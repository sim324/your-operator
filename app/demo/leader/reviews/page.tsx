import AddWebsiteForm from "@/components/demo/leader/add-website-form";
import GooglePlaceFinder from "@/components/demo/leader/google-place-finder";
import GoogleReviews from "@/components/demo/leader/google-reviews";
import ReviewHistoryFetcher from "@/components/demo/leader/review-history-fetcher";
import ReviewMetricsCard from "@/components/demo/leader/review-metrics-card";
import ReviewThemesCard from "@/components/demo/leader/review-themes-card";
import ReviewThemesFinder from "@/components/demo/leader/review-themes-finder";
import ReviewVolumeChart from "@/components/demo/leader/review-volume-chart";
import PageTitle from "@/components/demo/shared/page-title";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { getPlaceReviews, type PlaceReviews } from "@/lib/google-places/client";
import { getCurrentLeadCompany } from "@/lib/intake/current-company";
import { getReviewHistory } from "@/lib/reviews/history";
import { SAMPLE_PLACE_REVIEWS } from "@/lib/reviews/sample";
import { getReviewThemes } from "@/lib/reviews/themes";
import type {
  GooglePlaceStatus,
  GoogleReviewsStatus,
  LeadCompanyRow,
  LeadCompanySource,
  ReviewThemesStatus,
} from "@/lib/supabase/models";

const SOURCE_SAMPLE: LeadCompanySource = "sample";

// A fixed-width, independently scrolling column on desktop. Padding on every
// side keeps cards' ring and shadow from being clipped by the scroll, and
// children don't shrink: Card is overflow-hidden, which would otherwise let
// it squash to the column's height and clip itself instead of scrolling.
// Overscroll is off vertically only: turning it off sideways too would trap
// horizontal scrolls in the column instead of passing them to the row.
const COLUMN =
  "flex flex-col gap-6 lg:w-[32rem] lg:shrink-0 lg:snap-start lg:overflow-y-auto lg:overscroll-y-none lg:p-1 lg:pb-2 lg:*:shrink-0";

async function ReviewsSection({ company }: { company: LeadCompanyRow }) {
  if (company.source === SOURCE_SAMPLE) {
    return <GoogleReviews place={SAMPLE_PLACE_REVIEWS} isSample />;
  }

  if (!company.domain) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Needs a website</EmptyTitle>
          <EmptyDescription>
            Add one to find your Google listing
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <AddWebsiteForm />
        </EmptyContent>
      </Empty>
    );
  }

  const status = company.google_place_status as GooglePlaceStatus | null;

  if (status === "found" && company.google_place_id) {
    let place: PlaceReviews | null = null;
    try {
      place = await getPlaceReviews(company.google_place_id);
    } catch (err) {
      console.error("[leader/reviews] Places reviews fetch failed", err);
    }

    if (place) return <GoogleReviews place={place} />;

    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Couldn&apos;t load reviews</EmptyTitle>
          <EmptyDescription>Reload to try again</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <GooglePlaceFinder
      companyId={company.id}
      companyName={company.name ?? company.domain}
      initialStatus={status}
    />
  );
}

async function ReviewHistorySection({ company }: { company: LeadCompanyRow }) {
  const placeFound =
    (company.google_place_status as GooglePlaceStatus | null) === "found" &&
    company.google_maps_url;

  if (company.source === SOURCE_SAMPLE || !placeFound) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Review trends</EmptyTitle>
          <EmptyDescription>
            {company.source === SOURCE_SAMPLE
              ? "Not available for sample data"
              : "Find your Google listing first"}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const status = company.google_reviews_status as GoogleReviewsStatus | null;
  if (status !== "ready") {
    return (
      <ReviewHistoryFetcher companyId={company.id} initialStatus={status} />
    );
  }

  const history = await getReviewHistory(company.id);
  return (
    <>
      <ReviewMetricsCard history={history} />
      <ReviewVolumeChart monthly={history.monthly} />
    </>
  );
}

// Third column. Themes are read from the review history, so until it's
// pulled this is a placeholder.
async function ReviewThemesSection({ company }: { company: LeadCompanyRow }) {
  if (
    company.source === SOURCE_SAMPLE ||
    (company.google_reviews_status as GoogleReviewsStatus | null) !== "ready"
  ) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Review themes</EmptyTitle>
          <EmptyDescription>
            {company.source === SOURCE_SAMPLE
              ? "Not available for sample data"
              : "Pull your review history first"}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const status = company.review_themes_status as ReviewThemesStatus | null;
  if (status !== "ready") {
    return <ReviewThemesFinder companyId={company.id} initialStatus={status} />;
  }

  return <ReviewThemesCard data={await getReviewThemes(company.id)} />;
}

export default async function DemoLeaderReviewsPage() {
  const company = await getCurrentLeadCompany();

  // Fills the shell, like AI visibility. On desktop the three sections sit
  // side by side in a horizontally scrolling row, each column scrolling on
  // its own (data-fill-height tells the shell to fix the height for that).
  // On mobile they stack and the page scrolls. Empty states stretch to fill
  // their column; cards keep their natural height.
  return (
    <div data-fill-height className="flex min-h-0 flex-1 flex-col gap-6">
      <PageTitle>Reviews</PageTitle>
      {company ? (
        // The right edge fades out to show there's more to scroll to; the end
        // padding lets the last column scroll clear of the fade.
        <div className="flex flex-1 flex-col gap-6 lg:min-h-0 lg:snap-x lg:flex-row lg:overflow-x-auto lg:overscroll-none lg:pr-16 lg:[mask-image:linear-gradient(to_right,#000_calc(100%-4rem),transparent)]">
          <section className={COLUMN}>
            <ReviewsSection company={company} />
          </section>
          <section className={COLUMN}>
            <ReviewHistorySection company={company} />
          </section>
          <section className={COLUMN}>
            <ReviewThemesSection company={company} />
          </section>
        </div>
      ) : (
        <p className="text-muted-foreground">
          Submit the intake form to see your company&apos;s reviews here.
        </p>
      )}
    </div>
  );
}
