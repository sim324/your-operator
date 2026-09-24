"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DownloadIcon } from "lucide-react";

import { useCompanyRowUpdates } from "@/components/demo/leader/use-company-row-updates";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { fetchGoogleReviews } from "@/lib/reviews/actions";
import type { GoogleReviewsStatus } from "@/lib/supabase/models";

interface ReviewHistoryFetcherProps {
  companyId: string;
  initialStatus: GoogleReviewsStatus | null;
}

export default function ReviewHistoryFetcher({
  companyId,
  initialStatus,
}: ReviewHistoryFetcherProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, startTransition] = useTransition();

  useCompanyRowUpdates(companyId, (row) => {
    const next = row.google_reviews_status as GoogleReviewsStatus | null;
    setStatus(next);
    if (next === "ready") router.refresh();
  });

  function handleFetch() {
    setError(null);
    startTransition(async () => {
      const result = await fetchGoogleReviews();
      if (!result.ok) {
        setError(result.error ?? "Could not start pulling reviews.");
        return;
      }
      setStatus((current) => (current === "ready" ? current : "fetching"));
      router.refresh();
    });
  }

  const isFetching = isStarting || status === "fetching";

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>
          {isFetching
            ? "Pulling reviews"
            : status === "failed"
              ? "The pull didn't finish"
              : "See your review trends"}
        </EmptyTitle>
        <EmptyDescription>
          {isFetching
            ? "Collecting your most recent Google reviews"
            : status === "failed"
              ? "Something went wrong"
              : "Pull up to 1,000 of your Google reviews"}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={handleFetch} disabled={isFetching}>
          {isFetching ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <DownloadIcon data-icon="inline-start" />
          )}
          {status === "failed" ? "Try again" : "Pull review history"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </EmptyContent>
    </Empty>
  );
}
