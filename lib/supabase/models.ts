import type { Database } from "./types";

export type LeadCompanyRow =
  Database["public"]["Tables"]["lead_companies"]["Row"];
export type LeadCompanyInsert =
  Database["public"]["Tables"]["lead_companies"]["Insert"];

export type LeadContactRow =
  Database["public"]["Tables"]["lead_contacts"]["Row"];
export type LeadContactInsert =
  Database["public"]["Tables"]["lead_contacts"]["Insert"];

// Postgres CHECK constraints, not reflected in the generated column types
// (those come back as plain `string`). Keep in sync with
// supabase/migrations/20260922011537_lead_companies_and_contacts.sql.
export type LeadCompanySource = "firecrawl" | "clay" | "manual" | "sample";
export type LeadCompanyStatus = "pending" | "enriched" | "failed";
