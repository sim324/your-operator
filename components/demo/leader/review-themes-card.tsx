import { ChevronRightIcon, StarIcon } from "lucide-react";

import ReviewText from "@/components/demo/leader/review-text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReviewThemes } from "@/lib/reviews/themes";
import type { ReviewThemeCategory } from "@/lib/supabase/models";

const CATEGORY_LABELS: Record<ReviewThemeCategory, string> = {
  people_service: "People & service",
  price_billing: "Price & billing",
  scheduling_access: "Scheduling & access",
  results_quality: "Results & quality",
  communication: "Communication",
  place_product: "Place & product",
  other: "Other",
};

function formatDate(iso: string | null) {
  return iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;
}

export default function ReviewThemesCard({
  data,
}: {
  data: ReviewThemes;
}) {
  const top = Math.max(...data.themes.map((theme) => theme.share), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review themes</CardTitle>
        <CardDescription>
          What your {data.writtenReviews.toLocaleString()} written reviews talk
          about. A review can mention more than one theme.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border">
          {data.themes.map((theme) => (
            <li key={theme.id} className="py-3 first:pt-0 last:pb-0">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-start gap-3 [&::-webkit-details-marker]:hidden">
                  <ChevronRightIcon
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-medium">
                        {theme.name}
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          {CATEGORY_LABELS[theme.category]}
                        </span>
                      </p>
                      <p className="flex items-center gap-3 text-sm tabular-nums text-muted-foreground">
                        <span>
                          {theme.mentions.toLocaleString()} reviews ·{" "}
                          {Math.round(theme.share * 100)}%
                        </span>
                        {theme.averageRating !== null && (
                          <span className="inline-flex items-center gap-1">
                            <StarIcon
                              aria-hidden
                              className="size-3.5 fill-amber-400 text-amber-400"
                            />
                            {theme.averageRating.toFixed(1)} avg
                          </span>
                        )}
                      </p>
                    </div>
                    {/* Bars are scaled to the most-mentioned theme so the
                        differences between themes stay visible. */}
                    <div className="h-2 rounded-full bg-muted" aria-hidden>
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{
                          width: `${top ? (theme.share / top) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {theme.description}
                    </p>
                  </div>
                </summary>

                {theme.examples.length > 0 && (
                  <ul className="mt-3 space-y-3 border-l border-border pl-4 ml-7">
                    {theme.examples.map((example) => (
                      <li key={example.id} className="space-y-1">
                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                          {example.rating !== null && (
                            <span className="inline-flex items-center gap-1">
                              <StarIcon
                                aria-hidden
                                className="size-3 fill-amber-400 text-amber-400"
                              />
                              {example.rating}
                            </span>
                          )}
                          {formatDate(example.publishedAt)}
                        </p>
                        <ReviewText text={example.body} />
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
