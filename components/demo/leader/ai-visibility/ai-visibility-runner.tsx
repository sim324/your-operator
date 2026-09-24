"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SparklesIcon, XIcon } from "lucide-react";

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
import {
  cancelAiVisibility,
  checkAiVisibility,
  getAiVisibilityProgress,
  type AiVisibilityProgress,
} from "@/lib/ai-visibility/actions";
import type { AiVisibilityStatus } from "@/lib/supabase/models";

const PROGRESS_POLL_MS = 4000;

interface AiVisibilityRunnerProps {
  companyId: string;
  initialStatus: AiVisibilityStatus | null;
  // In progress far longer than a run takes (cancelled or killed); the
  // server will let it be started over.
  isStale: boolean;
}

function copyFor(
  status: AiVisibilityStatus | null,
  isStarting: boolean,
  isStuck: boolean,
) {
  if (isStuck) {
    return {
      title: "This check looks stuck",
      description:
        "It's been running much longer than a check normally takes, so it was probably cancelled or interrupted. Start it over to get fresh results.",
    };
  }
  if (isStarting || status === "generating") {
    return {
      title: "Writing searches",
      description: `Working out what a prospect would ask AI`,
    };
  }
  if (status === "checking") {
    return {
      title: "Asking Claude",
      description: "Running blind tests",
    };
  }
  if (status === "failed") {
    return {
      title: "The check didn't finish",
      description: "Something went wrong",
    };
  }
  return {
    title: "Does AI recommend you?",
    description: `We'll write 5 searches a customer would make, then ask AI`,
  };
}

export default function AiVisibilityRunner({
  companyId,
  initialStatus,
  isStale,
}: AiVisibilityRunnerProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, startTransition] = useTransition();
  const [isCancelling, cancelTransition] = useTransition();

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

  function handleCancel() {
    setError(null);
    cancelTransition(async () => {
      const result = await cancelAiVisibility();
      if (!result.ok) {
        setError(result.error ?? "Could not cancel the check.");
        return;
      }
      setStatus(null);
      setProgress(null);
      router.refresh();
    });
  }

  const inProgress = status === "generating" || status === "checking";
  // Stale only applies to the status the page loaded with; any live update
  // means the run is moving again.
  const isStuck =
    isStale && inProgress && status === initialStatus && !isStarting;
  const isWorking = isStarting || (inProgress && !isStuck);
  const copy = copyFor(status, isStarting, isStuck);

  return (
    <Empty className="">
      <EmptyHeader>
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
          {isStuck
            ? "Start over"
            : status === "failed"
              ? "Try again"
              : "Check AI visibility"}
        </Button>
        {inProgress && !isStarting && (
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <XIcon data-icon="inline-start" />
            )}
            Cancel
          </Button>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </EmptyContent>
    </Empty>
  );
}
