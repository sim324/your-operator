"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon, TagsIcon } from "lucide-react";

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
import { classifyReviews } from "@/lib/reviews/actions";
import type { ReviewThemesStatus } from "@/lib/supabase/models";

interface ReviewThemesFinderProps {
  companyId: string;
  initialStatus: ReviewThemesStatus | null;
}

function copyFor(status: ReviewThemesStatus | null, isStarting: boolean) {
  if (isStarting || status === "discovering") {
    return {
      title: "Reading your reviews",
      description:
        "Finding the topics your customers talk about most. This takes a minute or two.",
    };
  }
  if (status === "tagging") {
    return {
      title: "Sorting reviews into themes",
      description:
        "Themes found. Now tagging each review with the themes it mentions.",
    };
  }
  if (status === "failed") {
    return {
      title: "Couldn't find themes",
      description: "Something went wrong partway through. Give it another try.",
    };
  }
  return {
    title: "What are customers talking about?",
    description:
      "Group your written reviews into themes specific to your business, like staff, pricing or wait times, to see what comes up most.",
  };
}

export default function ReviewThemesFinder({
  companyId,
  initialStatus,
}: ReviewThemesFinderProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, startTransition] = useTransition();

  useCompanyRowUpdates(companyId, (row) => {
    const next = row.review_themes_status as ReviewThemesStatus | null;
    setStatus(next);
    if (next === "ready") router.refresh();
  });

  function handleClassify() {
    setError(null);
    startTransition(async () => {
      const result = await classifyReviews();
      if (!result.ok) {
        setError(result.error ?? "Could not start finding themes.");
        return;
      }
      setStatus((current) =>
        current === "ready" || current === "tagging" ? current : "discovering",
      );
      router.refresh();
    });
  }

  const isWorking =
    isStarting || status === "discovering" || status === "tagging";
  const copy = copyFor(status, isStarting);

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {isWorking ? <Spinner /> : <TagsIcon />}
        </EmptyMedia>
        <EmptyTitle>{copy.title}</EmptyTitle>
        <EmptyDescription>{copy.description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={handleClassify} disabled={isWorking}>
          {isWorking ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <SparklesIcon data-icon="inline-start" />
          )}
          {status === "failed" ? "Try again" : "Find themes"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </EmptyContent>
    </Empty>
  );
}
