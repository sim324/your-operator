"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPinIcon, SearchIcon } from "lucide-react";

import { useCompanyRowUpdates } from "@/components/demo/leader/use-company-row-updates";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { findGooglePlace } from "@/lib/reviews/actions";
import type { GooglePlaceStatus } from "@/lib/supabase/models";

interface GooglePlaceFinderProps {
  companyId: string;
  companyName: string;
  initialStatus: GooglePlaceStatus | null;
}

type LookupState = "idle" | "searching" | "not_found" | "failed";

function copyFor(state: LookupState, companyName: string) {
  switch (state) {
    case "searching":
      return {
        title: "Finding your Google listing",
        description:
          "Checking your site for a Maps link and matching it against Google. This usually takes under a minute.",
      };
    case "not_found":
      return {
        title: "We couldn't find your Google listing",
        description: `No Google Business listing matched ${companyName}'s website. Adding a Google Maps link to the site's contact page usually fixes this.`,
      };
    case "failed":
      return {
        title: "Something went wrong",
        description: "The lookup didn't finish. Give it another try.",
      };
    default:
      return {
        title: "Get started",
        description: `Pull in ${companyName}'s Google Business listing.`,
      };
  }
}

export default function GooglePlaceFinder({
  companyId,
  companyName,
  initialStatus,
}: GooglePlaceFinderProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, startTransition] = useTransition();

  // Once the workflow lands a result, re-render the server page to show the
  // reviews.
  useCompanyRowUpdates(companyId, (row) => {
    const next = row.google_place_status as GooglePlaceStatus | null;
    setStatus(next);
    if (next === "found") router.refresh();
  });

  function handleFind() {
    setError(null);
    startTransition(async () => {
      const result = await findGooglePlace();
      if (!result.ok) {
        setError(result.error ?? "Could not start the lookup.");
        return;
      }
      // Realtime will confirm, but don't leave the button idle meanwhile.
      setStatus((current) => (current === "found" ? current : "searching"));
      router.refresh();
    });
  }

  const isSearching = isStarting || status === "searching";
  const state: LookupState = isSearching
    ? "searching"
    : status === "not_found" || status === "failed"
    ? status
    : "idle";
  const copy = copyFor(state, companyName);

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {isSearching ? <Spinner /> : <MapPinIcon />}
        </EmptyMedia>
        <EmptyTitle className="font-sans">{copy.title}</EmptyTitle>
        <EmptyDescription>{copy.description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={handleFind} disabled={isSearching}>
          {isSearching ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <SearchIcon data-icon="inline-start" />
          )}
          {state === "not_found" || state === "failed" ? "Try again" : "Begin"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </EmptyContent>
    </Empty>
  );
}
