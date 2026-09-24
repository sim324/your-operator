"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RadarIcon, SparklesIcon } from "lucide-react";

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
import {
  checkAiVisibility,
  getAiVisibilityProgress,
  type AiVisibilityProgress,
} from "@/lib/ai-visibility/actions";
import type { AiVisibilityStatus } from "@/lib/supabase/models";

const PROGRESS_POLL_MS = 4000;

interface AiVisibilityRunnerProps {
  companyId: string;
  companyName: string;
  initialStatus: AiVisibilityStatus | null;
}

function copyFor(
  status: AiVisibilityStatus | null,
  isStarting: boolean,
  companyName: string,
) {
  if (isStarting || status === "generating") {
    return {
      title: "Writing your customers' searches",
      description: `Working out what someone would ask an AI assistant when they need what ${companyName} offers.`,
    };
  }
  if (status === "checking") {
    return {
      title: "Asking Claude",
      description:
        "Running each search 3 times with live web search, without telling Claude who you are. This takes a few minutes; you can leave this page and come back.",
    };
  }
  if (status === "failed") {
    return {
      title: "The check didn't finish",
      description: "Something went wrong partway through. Give it another try.",
    };
  }
  return {
    title: "Does AI recommend you?",
    description: `We'll write 5 searches a customer would make, like "best ___ near me", ask Claude each one 3 times with live web search, and see whether it recommends ${companyName}, where it ranks you, and who it picks instead.`,
  };
}

export default function AiVisibilityRunner({
  companyId,
  companyName,
  initialStatus,
}: AiVisibilityRunnerProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, startTransition] = useTransition();

  useCompanyRowUpdates(companyId, (row) => {
    const next = row.ai_visibility_status as AiVisibilityStatus | null;
    setStatus(next);
    if (next === "ready") router.refresh();
  });

  // Answers aren't readable over Realtime, so poll a count while checking.
  const [progress, setProgress] = useState<AiVisibilityProgress | null>(null);
  useEffect(() => {
    if (status !== "checking") return;

    let cancelled = false;
    const poll = async () => {
      const next = await getAiVisibilityProgress().catch(() => null);
      if (!cancelled && next) setProgress(next);
    };
    poll();
    const interval = setInterval(poll, PROGRESS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [status]);

  function handleRun() {
    setError(null);
    startTransition(async () => {
      const result = await checkAiVisibility();
      if (!result.ok) {
        setError(result.error ?? "Could not start the check.");
        return;
      }
      setStatus((current) =>
        current === "ready" || current === "checking" ? current : "generating",
      );
      router.refresh();
    });
  }

  const isWorking =
    isStarting || status === "generating" || status === "checking";
  const copy = copyFor(status, isStarting, companyName);

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {isWorking ? <Spinner /> : <RadarIcon />}
        </EmptyMedia>
        <EmptyTitle>{copy.title}</EmptyTitle>
        <EmptyDescription>{copy.description}</EmptyDescription>
      </EmptyHeader>
      {status === "checking" && progress && progress.total > 0 && (
        <div className="w-full max-w-xs space-y-2">
          <div
            role="progressbar"
            aria-label="Answers checked"
            aria-valuemin={0}
            aria-valuemax={progress.total}
            aria-valuenow={progress.done}
            className="h-2 rounded-full bg-muted"
          >
            <div
              className="h-2 rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
          <p className="text-sm tabular-nums text-muted-foreground">
            {progress.done} of {progress.total} answers checked
          </p>
        </div>
      )}
      <EmptyContent>
        <Button onClick={handleRun} disabled={isWorking}>
          {isWorking ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <SparklesIcon data-icon="inline-start" />
          )}
          {status === "failed" ? "Try again" : "Check AI visibility"}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </EmptyContent>
    </Empty>
  );
}
