import {
  abortActorRun,
  getActorRun,
  getDatasetItems,
  startActorRun,
  type ApifyRunStatus,
} from "@/lib/apify/client";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { ACTOR_TIMEOUT_SECS, MAX_REVIEWS } from "./constants";
import type {
  GoogleReviewsStatus,
  LeadReviewInsert,
} from "@/lib/supabase/models";

// Pay-per-result (~$0.30 per 1,000 reviews plus a small per-run start fee).
// Takes a Google Maps place URL and paginates internally.
const ACTOR_ID = "compass~google-maps-reviews-scraper";
// Dollar ceiling for one run: 1,000 reviews is ~$0.30, so this only trips
// if the actor's pricing changes under us.
const MAX_TOTAL_CHARGE_USD = 2;
const UPSERT_CHUNK = 200;

// Only the fields we map; the actor returns many more (place-level data is
// repeated on every item).
interface ApifyGoogleReview {
  reviewId?: string;
  reviewUrl?: string;
  stars?: number | null;
  text?: string | null;
  publishedAtDate?: string | null;
  responseFromOwnerText?: string | null;
  responseFromOwnerDate?: string | null;
}

export async function startReviewsRunStep(mapsUrl: string) {
  "use step";

  const run = await startActorRun(
    ACTOR_ID,
    {
      startUrls: [{ url: mapsUrl }],
      maxReviews: MAX_REVIEWS,
      reviewsSort: "newest",
      language: "en",
      // Metrics and the volume chart don't need reviewer identities, so don't
      // collect them.
      personalData: false,
    },
    {
      maxTotalChargeUsd: MAX_TOTAL_CHARGE_USD,
      timeoutSecs: ACTOR_TIMEOUT_SECS,
    },
  );

  return { runId: run.id, datasetId: run.defaultDatasetId };
}

// No retries: every attempt starts a brand-new paid Apify run.
startReviewsRunStep.maxRetries = 0;

export async function getReviewsRunStatusStep(
  runId: string,
): Promise<ApifyRunStatus> {
  "use step";

  return (await getActorRun(runId)).status;
}

export async function abortReviewsRunStep(runId: string) {
  "use step";

  await abortActorRun(runId);
}

function toRow(
  companyId: string,
  item: ApifyGoogleReview,
): LeadReviewInsert | null {
  const externalId = item.reviewId ?? item.reviewUrl;
  if (!externalId) return null;

  const rating = typeof item.stars === "number" ? Math.round(item.stars) : null;

  return {
    company_id: companyId,
    source: "google",
    external_id: externalId,
    rating: rating && rating >= 1 && rating <= 5 ? rating : null,
    body: item.text?.trim() || null,
    published_at: item.publishedAtDate ?? null,
    review_url: item.reviewUrl ?? null,
    owner_response: item.responseFromOwnerText?.trim() || null,
    owner_responded_at: item.responseFromOwnerDate ?? null,
    updated_at: new Date().toISOString(),
  };
}

// Reads the dataset and upserts in the same step so the (large) item list
// never passes through the workflow's event log. Retryable: re-reading a
// finished dataset costs nothing, and the upsert is idempotent.
export async function saveReviewsStep(
  companyId: string,
  datasetId: string,
): Promise<number> {
  "use step";

  const items = await getDatasetItems<ApifyGoogleReview>(datasetId);

  // A bulk ON CONFLICT can't touch the same key twice in one statement.
  const rows = new Map<string, LeadReviewInsert>();
  for (const item of items) {
    const row = toRow(companyId, item);
    if (row) rows.set(row.external_id, row);
  }

  const supabase = getSupabaseServerClient();
  const all = [...rows.values()];
  for (let i = 0; i < all.length; i += UPSERT_CHUNK) {
    const { error } = await supabase
      .from("lead_reviews")
      .upsert(all.slice(i, i + UPSERT_CHUNK), {
        onConflict: "company_id,source,external_id",
      });
    if (error) {
      throw new Error(`Failed to save reviews: ${error.message}`);
    }
  }

  return all.length;
}

export async function setReviewsStatusStep(
  companyId: string,
  status: GoogleReviewsStatus,
) {
  "use step";

  const supabase = getSupabaseServerClient();
  await supabase
    .from("lead_companies")
    .update({
      google_reviews_status: status,
      ...(status === "ready"
        ? { google_reviews_fetched_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", companyId);
}
