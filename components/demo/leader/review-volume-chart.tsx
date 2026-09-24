"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MonthlyReviewCount } from "@/lib/reviews/history";

// One series, so no legend: the card title names it. Brand primary rather
// than --chart-1, which is a light gray that barely reads on a white card.
const chartConfig = {
  count: { label: "Reviews", color: "var(--primary)" },
} satisfies ChartConfig;

function formatMonth(month: string, style: "short" | "long") {
  const [year, m] = month.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1, 1)).toLocaleDateString("en-US", {
    month: style === "short" ? "short" : "long",
    year: style === "short" ? "2-digit" : "numeric",
    timeZone: "UTC",
  });
}

export default function ReviewVolumeChart({
  monthly,
}: {
  monthly: MonthlyReviewCount[];
}) {
  const first = monthly[0]?.month;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews per month</CardTitle>
        <CardDescription>
          {first
            ? `${formatMonth(first, "long")} to today`
            : "No dated reviews yet"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <LineChart data={monthly} margin={{ top: 8, right: 8, left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => formatMonth(value, "short")}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatMonth(String(value), "long")}
                />
              }
            />
            <Line
              dataKey="count"
              type="linear"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ChartContainer>

        {/* Table view of the same data for screen readers. */}
        <table className="sr-only">
          <caption>Google reviews per month</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Reviews</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((row) => (
              <tr key={row.month}>
                <td>{formatMonth(row.month, "long")}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
