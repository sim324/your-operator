"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { checkAiVisibility } from "@/lib/ai-visibility/actions";

// Starts a fresh check. The new run replaces these results (its queries and
// answers overwrite the old ones), and the page switches to the progress
// view until it's done.
export default function RunAgainButton() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isStarting, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await checkAiVisibility();
      if (!result.ok) {
        setError(result.error ?? "Could not start the check.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isStarting}
      >
        {isStarting ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <RotateCwIcon data-icon="inline-start" />
        )}
        Run again
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
