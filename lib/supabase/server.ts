import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./types";

let client: SupabaseClient<Database> | undefined;

/**
 * Server-only Supabase client, authenticated with the secret key (bypasses
 * RLS). Never import this from a client component — it will throw via the
 * `server-only` guard if it ends up in a client bundle.
 */
export function getSupabaseServerClient(): SupabaseClient<Database> {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY env vars.",
    );
  }

  client = createClient<Database>(url, secretKey, {
    auth: { persistSession: false },
  });

  return client;
}
