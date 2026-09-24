import { FatalError, RetryableError } from "workflow";

const FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1";

// Only used to classify Firecrawl's response, not to auth other calls.
function firecrawlHeaders() {
  return {
    Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function firecrawlRequest(path: string, body: unknown) {
  const response = await fetch(`${FIRECRAWL_BASE_URL}${path}`, {
    method: "POST",
    headers: firecrawlHeaders(),
    body: JSON.stringify(body),
  });

  if (response.status === 429) {
    const retryAfterSeconds = Number(response.headers.get("retry-after"));
    const retryAfterMs =
      Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
        ? retryAfterSeconds * 1000
        : 30_000;
    throw new RetryableError("Firecrawl rate limited", {
      retryAfter: retryAfterMs,
    });
  }

  if (response.status === 404 || response.status === 400) {
    throw new FatalError(
      `Firecrawl ${path} rejected the request (${response.status})`,
    );
  }

  if (!response.ok) {
    throw new Error(`Firecrawl ${path} failed with status ${response.status}`);
  }

  return response.json();
}
