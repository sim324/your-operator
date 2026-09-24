import { FatalError, sleep } from "workflow";

import { ACTOR_TIMEOUT_SECS } from "./constants";
import {
  abortReviewsRunStep,
  getReviewsRunStatusStep,
  saveReviewsStep,
  setReviewsStatusStep,
  startReviewsRunStep,
} from "./steps";

const POLL_INTERVAL_SECS = 15;
// A little past the actor's own timeout, so Apify's TIMED-OUT normally wins
// and this is only a backstop.
const MAX_POLLS = Math.ceil((ACTOR_TIMEOUT_SECS + 120) / POLL_INTERVAL_SECS);

// Started from the leader page's "Pull review history" button (see
// lib/reviews/actions.ts) once a Google place has been found. The caller has
// already set google_reviews_status to "fetching".
export async function fetchGoogleReviewsWorkflow(
  companyId: string,
  mapsUrl: string,
) {
  "use workflow";

  let runId: string | null = null;

  try {
    const run = await startReviewsRunStep(mapsUrl);
    runId = run.runId;

    // Durable sleep between polls: nothing is running (or billing on our
    // side) while the actor works, and no step has to outlive a function
    // invocation.
    let status = await getReviewsRunStatusStep(runId);
    for (
      let polls = 0;
      (status === "READY" || status === "RUNNING") && polls < MAX_POLLS;
      polls++
    ) {
      await sleep(`${POLL_INTERVAL_SECS}s`);
      status = await getReviewsRunStatusStep(runId);
    }

    if (status === "READY" || status === "RUNNING") {
      await abortReviewsRunStep(runId);
      throw new FatalError(`Apify run ${runId} did not finish in time`);
    }
    if (status !== "SUCCEEDED") {
      throw new FatalError(`Apify run ${runId} ended: ${status}`);
    }

    const saved = await saveReviewsStep(companyId, run.datasetId);
    await setReviewsStatusStep(companyId, "ready");
    return { runId, saved };
  } catch (err) {
    await setReviewsStatusStep(companyId, "failed");
    throw err;
  }
}
