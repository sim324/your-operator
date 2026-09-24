"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { addWebsiteAndFindGooglePlace } from "@/lib/reviews/actions";

export default function AddWebsiteForm() {
  const router = useRouter();
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await addWebsiteAndFindGooglePlace(website);
      if (!result.ok) {
        setError(result.error ?? "Could not save the website.");
        return;
      }
      // The page now has a domain and a "searching" status, so it renders
      // GooglePlaceFinder, which watches the lookup from here.
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
      <div className="flex w-full gap-2">
        <Input
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="acme.com"
          aria-label="Company website"
          aria-invalid={error ? true : undefined}
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          disabled={isPending}
          required
        />
        <Button type="submit" disabled={isPending || !website.trim()}>
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <SearchIcon data-icon="inline-start" />
          )}
          Find reviews
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
