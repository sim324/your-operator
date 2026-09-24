import { StarIcon } from "lucide-react";

import ReviewText from "@/components/demo/leader/review-text";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PlaceReviews } from "@/lib/google-places/client";
import { cn } from "@/lib/utils";

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon
          key={n}
          aria-hidden
          className={
            n <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/40"
          }
        />
      ))}
    </span>
  );
}

interface GoogleReviewsProps {
  place: PlaceReviews;
  isSample?: boolean;
}

// Google's Places terms require the Google Maps attribution and each
// review's author attribution (name + link) wherever the content is shown.
export default function GoogleReviews({ place, isSample }: GoogleReviewsProps) {
  const reviews = place.reviews ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-black">Google reviews</CardTitle>
        <CardDescription>
          {place.googleMapsUri ? (
            <a
              href={place.googleMapsUri}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              {place.displayName?.text ?? "View on Google Maps"}
            </a>
          ) : (
            place.displayName?.text
          )}
        </CardDescription>
        {isSample && (
          <CardAction>
            <Badge variant="secondary">Sample data</Badge>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-7xl font-black tabular-nums">
            {place.rating?.toFixed(1) ?? "--"}
          </span>
          <div className="space-y-1 pb-1">
            {place.rating !== undefined && <Stars rating={place.rating} />}
            <p className="text-sm text-muted-foreground">
              {(place.userRatingCount ?? 0).toLocaleString()} reviews
            </p>
          </div>
        </div>

        {reviews.length > 0 ? (
          <ul className="divide-y divide-border">
            {reviews.map((review) => {
              const author = review.authorAttribution;
              return (
                <li key={review.name} className="space-y-2 py-4 first:pt-0">
                  <div className="flex items-center gap-2">
                    {author?.photoUri && (
                      // eslint-disable-next-line @next/next/no-img-element -- Google-hosted author photo
                      <img
                        src={author.photoUri}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="size-7 rounded-full"
                      />
                    )}
                    {author?.uri ? (
                      <a
                        href={author.uri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium hover:underline"
                      >
                        {author.displayName ?? "Google user"}
                      </a>
                    ) : (
                      <span className="text-sm font-medium">
                        {author?.displayName ?? "Google user"}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {review.relativePublishTimeDescription}
                    </span>
                  </div>
                  {review.rating !== undefined && (
                    <Stars
                      rating={review.rating}
                      className="[&_svg]:size-3.5"
                    />
                  )}
                  {review.text?.text && <ReviewText text={review.text.text} />}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            This listing doesn&apos;t have any written reviews yet.
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Rating and reviews from Google Maps. Google shows up to 5 of the most
          relevant reviews.
        </p>
      </CardContent>
    </Card>
  );
}
