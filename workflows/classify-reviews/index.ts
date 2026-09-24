import {
  discoverThemesStep,
  listWrittenReviewIdsStep,
  setThemesStatusStep,
  tagReviewBatchStep,
} from "./steps";

// 50 reviews keeps each tagging call's output small and a failed batch cheap
// to retry; 4 at a time stays well inside API rate limits.
const BATCH_SIZE = 50;
const CONCURRENCY = 4;

// Started from the leader page's "Find themes" button (see
// lib/reviews/actions.ts) once the review history is pulled. The caller has
// already set review_themes_status to "discovering".
export async function classifyReviewsWorkflow(companyId: string) {
  "use workflow";

  try {
    const themeCount = await discoverThemesStep(companyId);

    await setThemesStatusStep(companyId, "tagging");
    const reviewIds = await listWrittenReviewIdsStep(companyId);

    const batches: string[][] = [];
    for (let i = 0; i < reviewIds.length; i += BATCH_SIZE) {
      batches.push(reviewIds.slice(i, i + BATCH_SIZE));
    }

    // Raw Promise.all only: allSettled/.catch over steps swallows the
    // runtime's suspend signal and hangs the workflow.
    let tagged = 0;
    for (let i = 0; i < batches.length; i += CONCURRENCY) {
      const counts = await Promise.all(
        batches
          .slice(i, i + CONCURRENCY)
          .map((batch) => tagReviewBatchStep(companyId, batch)),
      );
      tagged += counts.reduce((sum, n) => sum + n, 0);
    }

    await setThemesStatusStep(companyId, "ready");
    return { themeCount, reviews: reviewIds.length, tagged };
  } catch (err) {
    await setThemesStatusStep(companyId, "failed");
    throw err;
  }
}
