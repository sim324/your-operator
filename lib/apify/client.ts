import { FatalError, RetryableError } from "workflow";

// Apify REST API, split into start / status / dataset calls so a workflow can
// poll with durable sleep() between steps instead of block-polling inside
// one long step (which would have to fit in a single function invocation).
//
// Actor ids use Apify's "username~actor-name" slug (tilde, not slash).
const APIFY_BASE_URL = "https://api.apify.com/v2";

export type ApifyRunStatus =
  | "READY"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "ABORTING"
  | "ABORTED"
  | "TIMING-OUT"
  | "TIMED-OUT";

export interface ApifyRun {
  id: string;
  status: ApifyRunStatus;
  defaultDatasetId: string;
}

function apifyToken() {
  const token = process.env.APIFY_TOKEN;
  if (!token) throw new FatalError("APIFY_TOKEN is not set.");
  return token;
}

async function apifyRequest(path: string, init?: RequestInit) {
  const response = await fetch(`${APIFY_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apifyToken()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (response.status === 429) {
    throw new RetryableError("Apify rate limited", { retryAfter: 30_000 });
  }
  if (response.status >= 400 && response.status < 500) {
    throw new FatalError(
      `Apify ${path} rejected the request (${response.status}): ${(await response.text()).slice(0, 300)}`,
    );
  }
  if (!response.ok) {
    throw new Error(`Apify ${path} failed with status ${response.status}`);
  }

  return response.json();
}

// Cost safety is maxTotalChargeUsd (a dollar cap), not maxItems: Apify
// derives an implied budget from maxItems using only the per-item price,
// which ignores an actor's flat start fee and can abort a run with zero
// results (learned in reputation-dashboard-backend).
export async function startActorRun(
  actorId: string,
  input: object,
  opts: { maxTotalChargeUsd: number; timeoutSecs: number },
): Promise<ApifyRun> {
  const params = new URLSearchParams({
    maxTotalChargeUsd: String(opts.maxTotalChargeUsd),
    timeout: String(opts.timeoutSecs),
  });

  const { data } = (await apifyRequest(`/acts/${actorId}/runs?${params}`, {
    method: "POST",
    body: JSON.stringify(input),
  })) as { data: ApifyRun };

  return data;
}

export async function getActorRun(runId: string): Promise<ApifyRun> {
  const { data } = (await apifyRequest(`/actor-runs/${runId}`)) as {
    data: ApifyRun;
  };
  return data;
}

export async function abortActorRun(runId: string): Promise<void> {
  await apifyRequest(`/actor-runs/${runId}/abort`, { method: "POST" });
}

export async function getDatasetItems<T>(datasetId: string): Promise<T[]> {
  const items: T[] = [];
  const limit = 1000;

  for (let offset = 0; ; offset += limit) {
    const batch = (await apifyRequest(
      `/datasets/${datasetId}/items?clean=true&offset=${offset}&limit=${limit}`,
    )) as T[];
    items.push(...batch);
    if (batch.length < limit) break;
  }

  return items;
}
