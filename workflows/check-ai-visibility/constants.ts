// Import-free so both the workflow body and the progress action can use it
// without pulling in the steps' server-only dependencies.

// Answers vary run to run, so each query is asked this many times and the
// page reports how often the business came up.
export const ATTEMPTS_PER_QUERY = 3;
