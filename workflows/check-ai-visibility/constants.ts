// Import-free so both the workflow body and the progress action can use it
// without pulling in the steps' server-only dependencies.

// Answers vary run to run, so each query is asked this many times and the
// page reports how often the business came up.
export const ATTEMPTS_PER_QUERY = 3;

// A check still "generating" or "checking" this long after its last status
// change is treated as stuck (cancelled, or killed mid-step) and can be
// started over. A normal run finishes in a few minutes.
export const STALE_RUN_MS = 15 * 60 * 1000;
