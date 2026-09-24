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

async function ReviewsSection({ company }: { company: LeadCompanyRow }) {
  if (company.source === SOURCE_SAMPLE) {
    return <GoogleReviews place={SAMPLE_PLACE_REVIEWS} isSample />;
  }

  if (!company.domain) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>No website to match</EmptyTitle>
          <EmptyDescription>
            Google reviews are matched through your website, and this company
            was added without one. Add it to find your Google listing.
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
      console.error("[leader] Places reviews fetch failed", err);
    }

    if (place) return <GoogleReviews place={place} />;

    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Couldn&apos;t load Google reviews</EmptyTitle>
          <EmptyDescription>
            We found the listing but Google didn&apos;t return its reviews.
            Reload to try again.
          </EmptyDescription>
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
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Review trends</EmptyTitle>
          <EmptyDescription>
            {company.source === SOURCE_SAMPLE
              ? "Review history isn't available for sample data."
              : "Find your Google listing first, then pull your review history here."}
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
      <ReviewMetricsCard
        history={history}
        fetchedAt={company.google_reviews_fetched_at}
      />
      <ReviewVolumeChart monthly={history.monthly} />
    </>
  );
}

// Full-width row under the split, once there's review history to theme.
async function ReviewThemesSection({ company }: { company: LeadCompanyRow }) {
  if (
    company.source === SOURCE_SAMPLE ||
    (company.google_reviews_status as GoogleReviewsStatus | null) !== "ready"
  ) {
    return null;
  }

  const status = company.review_themes_status as ReviewThemesStatus | null;
  if (status !== "ready") {
    return <ReviewThemesFinder companyId={company.id} initialStatus={status} />;
  }

  return <ReviewThemesCard data={await getReviewThemes(company.id)} />;
}

export default async function DemoLeaderPage() {
  const company = await getCurrentLeadCompany();

  return (
    <div className="space-y-6">
      <PageTitle>Leader Dashboard</PageTitle>
      {company ? (
        <>
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <section>
              <ReviewsSection company={company} />
            </section>
            <section className="space-y-6">
              <ReviewHistorySection company={company} />
            </section>
          </div>
          <section>
            <ReviewThemesSection company={company} />
          </section>
        </>
      ) : (
        <p className="text-muted-foreground">
          Submit the intake form to see your company&apos;s reviews here.
        </p>
      )}
    </div>
  );
}
