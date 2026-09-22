import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

let client: SupabaseClient<Database> | undefined;

/**
 * Browser-safe Supabase client, authenticated with the publishable key.
 * RLS governs what this can read/write - see the "Public read access to
 * lead companies" policy for why the intake dialog can subscribe to a
 * company row's progress live.
 */
export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY env vars.",
    );
  }

  client = createClient<Database>(url, publishableKey);

  return client;
}
