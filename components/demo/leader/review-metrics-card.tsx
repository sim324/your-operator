import StatCard from "@/components/demo/leader/stat-card";
import type { ReviewHistory } from "@/lib/reviews/history";

// The four headline review numbers as stat cards, matching AI visibility.
export default function ReviewMetricsCard({
  history,
}: {
  history: ReviewHistory;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard label="Reviews" value={history.total.toLocaleString()} />
      <StatCard
        label="Average rating"
        value={history.averageRating?.toFixed(2) ?? "--"}
      />
      <StatCard
        label="Last 90 days"
        value={history.last90Days.toLocaleString()}
      />
      <StatCard
        label="Response rate"
        value={`${Math.round(history.responseRate * 100)}%`}
      />
    </div>
  );
}
