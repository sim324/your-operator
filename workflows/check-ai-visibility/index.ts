import { ATTEMPTS_PER_QUERY } from "./constants";
import {
  answerQueryStep,
  extractAnswerStep,
  generateQueriesStep,
  setVisibilityStatusStep,
} from "./steps";

// Started from the AI visibility page's "Check AI visibility" button (see
// lib/ai-visibility/actions.ts). The caller has already set
// ai_visibility_status to "generating".
export async function checkAiVisibilityWorkflow(companyId: string) {
  "use workflow";

  try {
    const queryIds = await generateQueriesStep(companyId);

    await setVisibilityStatusStep(companyId, "checking");

    const jobs = queryIds.flatMap((queryId) =>
      Array.from({ length: ATTEMPTS_PER_QUERY }, (_, i) => ({
        queryId,
        attempt: i + 1,
      })),
    );

    // Every answer + parse pair runs in parallel. Raw Promise.all only:
    // allSettled/.catch over steps swallows the runtime's suspend signal and
    // hangs the workflow.
    await Promise.all(
      jobs.map(async ({ queryId, attempt }) => {
        const { answerId, failed } = await answerQueryStep(
          companyId,
          queryId,
          attempt,
        );
        // A failed answer is already recorded; there's nothing to parse.
        if (!failed) await extractAnswerStep(answerId);
      }),
    );

    await setVisibilityStatusStep(companyId, "ready");
    return { queries: queryIds.length, answers: jobs.length };
  } catch (err) {
    await setVisibilityStatusStep(companyId, "failed");
    throw err;
  }
}
