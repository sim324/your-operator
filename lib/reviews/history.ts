import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface MonthlyReviewCount {
  // "2024-03", first of the month in UTC
  month: string;
  count: number;
}

export interface ReviewHistory {
  total: number;
  averageRating: number | null;
  last90Days: number;
  // Share of reviews with an owner response, 0–1
  responseRate: number;
  earliest: string | null;
  monthly: MonthlyReviewCount[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Every month from the earliest review through the current month, zeros
// included: a month with no reviews is real signal on a volume chart, and
// skipping it would make the line lie about the gap.
function monthlySeries(dates: Date[], now: Date): MonthlyReviewCount[] {
  if (!dates.length) return [];

  const counts = new Map<string, number>();
  for (const date of dates) {
    const key = monthKey(date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const earliest = dates.reduce((min, d) => (d < min ? d : min));
  const cursor = new Date(
    Date.UTC(earliest.getUTCFullYear(), earliest.getUTCMonth(), 1),
  );
  const series: MonthlyReviewCount[] = [];
  while (cursor <= now) {
    const key = monthKey(cursor);
    series.push({ month: key, count: counts.get(key) ?? 0 });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return series;
}

export async function getReviewHistory(
  companyId: string,
): Promise<ReviewHistory> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("lead_reviews")
    .select("rating, published_at, owner_response")
    .eq("company_id", companyId)
    .eq("source", "google")
    .limit(2000);

  if (error) throw new Error(`Failed to load reviews: ${error.message}`);

  const rows = data ?? [];
  const now = new Date();
  const dates = rows
    .map((row) => (row.published_at ? new Date(row.published_at) : null))
    .filter((date): date is Date => date !== null);
  const ratings = rows
    .map((row) => row.rating)
    .filter((rating): rating is number => rating !== null);

  return {
    total: rows.length,
    averageRating: ratings.length
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : null,
    last90Days: dates.filter((d) => now.getTime() - d.getTime() <= 90 * DAY_MS)
      .length,
    responseRate: rows.length
      ? rows.filter((row) => row.owner_response).length / rows.length
      : 0,
    earliest: dates.length
      ? dates.reduce((min, d) => (d < min ? d : min)).toISOString()
      : null,
    monthly: monthlySeries(dates, now),
  };
}
