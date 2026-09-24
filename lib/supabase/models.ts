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
// supabase/migrations/20260922011537_lead_companies_and_contacts.sql,
// supabase/migrations/20260922014703_enrichment_progress_and_logo_bucket.sql,
// and supabase/migrations/20260922020000_uploading_status_and_public_read.sql.
export type LeadCompanySource = "firecrawl" | "clay" | "manual" | "sample";
export type LeadCompanyStatus =
  | "pending"
  | "scraping"
  | "structuring"
  | "uploading"
  | "enriched"
  | "failed";

// supabase/migrations/20260923120000_google_place_lookup.sql. Null (not in
// this union) means the lookup was never started.
export type GooglePlaceStatus = "searching" | "found" | "not_found" | "failed";

export type LeadReviewRow = Database["public"]["Tables"]["lead_reviews"]["Row"];
export type LeadReviewInsert =
  Database["public"]["Tables"]["lead_reviews"]["Insert"];

// supabase/migrations/20260924120000_lead_reviews.sql. Null = never pulled.
export type GoogleReviewsStatus = "fetching" | "ready" | "failed";

export type ReviewThemeRow =
  Database["public"]["Tables"]["review_themes"]["Row"];

// supabase/migrations/20260925120000_review_themes.sql. Null = never run.
export type ReviewThemesStatus = "discovering" | "tagging" | "ready" | "failed";

// Shared across companies so different businesses stay comparable. Keep in
// sync with the review_themes.category CHECK constraint.
export const REVIEW_THEME_CATEGORIES = [
  "people_service",
  "price_billing",
  "scheduling_access",
  "results_quality",
  "communication",
  "place_product",
  "other",
] as const;
export type ReviewThemeCategory = (typeof REVIEW_THEME_CATEGORIES)[number];

// supabase/migrations/20260926120000_ai_visibility.sql. Null = never run.
export type AiVisibilityStatus = "generating" | "checking" | "ready" | "failed";

// Keep in sync with the ai_visibility_queries.intent CHECK constraint.
export const AI_VISIBILITY_INTENTS = [
  "service_location",
  "best_near_me",
  "problem",
  "comparison",
] as const;
export type AiVisibilityIntent = (typeof AI_VISIBILITY_INTENTS)[number];

// lead_companies.ai_visibility_location: the web search tool's approximate
// user location, so "near me" resolves to where the business is.
export interface AiVisibilityLocation {
  city: string;
  region: string;
  // ISO 3166-1 alpha-2, e.g. "US"
  country: string;
  // IANA, e.g. "America/Denver"
  timezone: string;
}

export interface AiVisibilityBusiness {
  name: string;
  website: string | null;
}

export interface AiVisibilityCitation {
  url: string;
  title: string | null;
}
