"use server";

import { start } from "workflow/api";

import { getCurrentLeadCompany } from "@/lib/intake/current-company";
import { isPlausibleDomain, normalizeDomain } from "@/lib/intake/domain";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  GooglePlaceStatus,
  GoogleReviewsStatus,
  ReviewThemesStatus,
} from "@/lib/supabase/models";
import { classifyReviewsWorkflow } from "@/workflows/classify-reviews";
import { fetchGoogleReviewsWorkflow } from "@/workflows/fetch-google-reviews";
import { findGooglePlaceWorkflow } from "@/workflows/find-google-place";

export interface ReviewsActionResult {
  ok: boolean;
  error?: string;
}

// The company comes from the demo cookie, never from the client, so a direct
// POST can only start a lookup for the caller's own company.
export async function findGooglePlace(): Promise<ReviewsActionResult> {
  const company = await getCurrentLeadCompany();
  if (!company) {
    return { ok: false, error: "Submit the intake form first." };
  }
  if (!company.domain) {
    return { ok: false, error: "We need a website to find a Google listing." };
  }

  // Each lookup costs Firecrawl + Places calls, so claim the row atomically:
  // only a never-run or retryable lookup flips to "searching", and a double
  // click or a lookup that already found the place starts nothing.
  const searching: GooglePlaceStatus = "searching";
  const failed: GooglePlaceStatus = "failed";
  const supabase = getSupabaseServerClient();
  const { data: claimed, error } = await supabase
    .from("lead_companies")
    .update({ google_place_status: searching })
    .eq("id", company.id)
    .or(
      "google_place_status.is.null,google_place_status.eq.not_found,google_place_status.eq.failed",
    )
    .select("id");

  if (error) {
    return { ok: false, error: "Could not start the lookup." };
  }
  if (!claimed?.length) {
    return { ok: true };
  }

  try {
    await start(findGooglePlaceWorkflow, [
      company.id,
      company.domain,
      company.name,
    ]);
  } catch {
    await supabase
      .from("lead_companies")
      .update({ google_place_status: failed })
      .eq("id", company.id);
    return { ok: false, error: "Could not start the lookup." };
  }

  return { ok: true };
}

// For companies that came through intake without a website (the name +
// description fallback). Saves the domain, then starts the same lookup the
// "Find Google reviews" button does. It does not re-run company enrichment.
export async function addWebsiteAndFindGooglePlace(
  website: string,
): Promise<ReviewsActionResult> {
  const company = await getCurrentLeadCompany();
  if (!company) {
    return { ok: false, error: "Submit the intake form first." };
  }

  const domain = normalizeDomain(website);
  if (!isPlausibleDomain(domain)) {
    return { ok: false, error: "Enter a website like acme.com." };
  }

  // Only fill in a missing domain; never overwrite one a company already has.
  const supabase = getSupabaseServerClient();
  const { data: updated, error } = await supabase
    .from("lead_companies")
    .update({ domain })
    .eq("id", company.id)
    .is("domain", null)
    .select("id");

  if (error) {
    // lead_companies.domain is unique.
    return {
      ok: false,
      error:
        error.code === "23505"
          ? "That website already belongs to another company in the demo."
          : "Could not save the website.",
    };
  }
  if (!updated?.length) {
    return { ok: false, error: "This company already has a website." };
  }

  return findGooglePlace();
}

// The "Pull review history" button: runs the paid Apify reviews actor on the
// Maps URL the place lookup saved. Needs a found place first.
export async function fetchGoogleReviews(): Promise<ReviewsActionResult> {
  const company = await getCurrentLeadCompany();
  if (!company) {
    return { ok: false, error: "Submit the intake form first." };
  }
  if (!company.google_maps_url) {
    return { ok: false, error: "Find the Google listing first." };
  }

  // Same atomic claim as findGooglePlace: only a never-run or failed pull
  // flips to "fetching", so a double click can't start two paid runs.
  const fetching: GoogleReviewsStatus = "fetching";
  const failed: GoogleReviewsStatus = "failed";
  const supabase = getSupabaseServerClient();
  const { data: claimed, error } = await supabase
    .from("lead_companies")
    .update({ google_reviews_status: fetching })
    .eq("id", company.id)
    .or("google_reviews_status.is.null,google_reviews_status.eq.failed")
    .select("id");

  if (error) {
    return { ok: false, error: "Could not start pulling reviews." };
  }
  if (!claimed?.length) {
    return { ok: true };
  }

  try {
    await start(fetchGoogleReviewsWorkflow, [
      company.id,
      company.google_maps_url,
    ]);
  } catch {
    await supabase
      .from("lead_companies")
      .update({ google_reviews_status: failed })
      .eq("id", company.id);
    return { ok: false, error: "Could not start pulling reviews." };
  }

  return { ok: true };
}

// The "Find themes" button: Claude proposes themes for this company's
// reviews, then tags each written review with them. Needs the review history
// pulled first.
export async function classifyReviews(): Promise<ReviewsActionResult> {
  const company = await getCurrentLeadCompany();
  if (!company) {
    return { ok: false, error: "Submit the intake form first." };
  }
  if (
    (company.google_reviews_status as GoogleReviewsStatus | null) !== "ready"
  ) {
    return { ok: false, error: "Pull your review history first." };
  }

  // Same atomic claim as the other buttons: themes aren't editable, so only
  // a never-run or failed classification can start.
  const discovering: ReviewThemesStatus = "discovering";
  const failed: ReviewThemesStatus = "failed";
  const supabase = getSupabaseServerClient();
  const { data: claimed, error } = await supabase
    .from("lead_companies")
    .update({ review_themes_status: discovering })
    .eq("id", company.id)
    .or("review_themes_status.is.null,review_themes_status.eq.failed")
    .select("id");

  if (error) {
    return { ok: false, error: "Could not start finding themes." };
  }
  if (!claimed?.length) {
    return { ok: true };
  }

  try {
    await start(classifyReviewsWorkflow, [company.id]);
  } catch {
    await supabase
      .from("lead_companies")
      .update({ review_themes_status: failed })
      .eq("id", company.id);
    return { ok: false, error: "Could not start finding themes." };
  }

  return { ok: true };
}
