// Import-free so the workflow body can use these without pulling the steps'
// server-only dependencies into the workflow bundle.

export const MAX_REVIEWS = 1000;
// Apify stops the run itself (and stops billing) after this; the workflow's
// poll budget sits a little past it.
export const ACTOR_TIMEOUT_SECS = 20 * 60;
