"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "lucide-react";

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
      description: "Finding what customers talk about",
    };
  }
  if (status === "tagging") {
    return {
      title: "Sorting reviews",
      description: "Tagging each review with its themes",
    };
  }
  if (status === "failed") {
    return {
      title: "Couldn't find themes",
      description: "Something went wrong",
    };
  }
  return {
    title: "What are customers talking about?",
    description: "We'll group your reviews into themes",
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
    <Empty>
      <EmptyHeader>
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
