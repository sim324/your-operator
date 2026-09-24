import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReviewHistory } from "@/lib/reviews/history";
import { MAX_REVIEWS } from "@/workflows/fetch-google-reviews/constants";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-black tabular-nums">{value}</p>
    </div>
  );
}

export default function ReviewMetricsCard({
  history,
  fetchedAt,
}: {
  history: ReviewHistory;
  fetchedAt: string | null;
}) {
  const since = history.earliest
    ? new Date(history.earliest).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;
  const pulled = fetchedAt
    ? new Date(fetchedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review metrics</CardTitle>
        <CardDescription>
          {history.total >= MAX_REVIEWS
            ? `Your ${MAX_REVIEWS.toLocaleString()} most recent Google reviews`
            : "All your Google reviews"}
          {since && `, since ${since}`}
          {pulled && `. Pulled ${pulled}.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-6">
        <Stat label="Reviews" value={history.total.toLocaleString()} />
        <Stat
          label="Average rating"
          value={history.averageRating?.toFixed(2) ?? "–"}
        />
        <Stat label="Last 90 days" value={history.last90Days.toLocaleString()} />
        <Stat
          label="Owner response rate"
          value={`${Math.round(history.responseRate * 100)}%`}
        />
      </CardContent>
    </Card>
  );
}
