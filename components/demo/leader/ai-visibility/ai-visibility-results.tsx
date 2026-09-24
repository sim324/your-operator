import { ExternalLinkIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AiVisibilityResults } from "@/lib/ai-visibility/results";
import type {
  AiVisibilityIntent,
  AiVisibilityLocation,
} from "@/lib/supabase/models";
import { cn } from "@/lib/utils";
import { ATTEMPTS_PER_QUERY } from "@/workflows/check-ai-visibility/constants";

const INTENT_LABELS: Record<AiVisibilityIntent, string> = {
  service_location: "Service + place",
  best_near_me: "Best near me",
  problem: "Problem",
  comparison: "Comparison",
};

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-black tabular-nums">{value}</p>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}

// One dot per run: filled when that run recommended the business. The text
// beside it carries the same information, so color isn't the only signal.
function RunDots({ mentions, runs }: { mentions: number; runs: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex gap-1" aria-hidden>
        {Array.from({ length: runs }, (_, i) => (
          <span
            key={i}
            className={cn(
              "size-2.5 rounded-full",
              i < mentions ? "bg-primary" : "bg-muted ring-1 ring-border",
            )}
          />
        ))}
      </span>
      <span className="tabular-nums">
        {mentions} of {runs}
      </span>
    </span>
  );
}

function formatLocation(location: AiVisibilityLocation | null) {
  if (!location) return null;
  return [location.city, location.region].filter(Boolean).join(", ");
}

export default function AiVisibilityResultsView({
  results,
  companyName,
  location,
  checkedAt,
}: {
  results: AiVisibilityResults;
  companyName: string;
  location: AiVisibilityLocation | null;
  checkedAt: string | null;
}) {
  const place = formatLocation(location);
  const checked = checkedAt
    ? new Date(checkedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;
  const visibility = results.totalRuns
    ? Math.round((results.mentionedRuns / results.totalRuns) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>How often Claude recommends {companyName}</CardTitle>
          <CardDescription>
            {results.queries.length} unbranded searches, each asked{" "}
            {ATTEMPTS_PER_QUERY} times with live web search
            {place && `, searching from ${place}`}
            {checked && `. Checked ${checked}.`} Claude was never told which
            business we were looking for.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Stat
            label="Recommended in"
            value={`${visibility}%`}
            detail={`${results.mentionedRuns} of ${results.totalRuns} answers${
              results.failedRuns
                ? ` (${results.failedRuns} couldn't be answered)`
                : ""
            }`}
          />
          <Stat
            label="Searches you appear in"
            value={`${results.queriesWithMention} of ${results.queries.length}`}
            detail="at least once"
          />
          <Stat
            label="Average position"
            value={
              results.averageRank !== null
                ? `#${results.averageRank.toFixed(1)}`
                : "–"
            }
            detail="when recommended"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Searches</CardTitle>
          <CardDescription>
            What a customer might ask, and whether Claude&apos;s answer included
            you.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Search
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Recommended
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Best position
                </th>
                <th scope="col" className="py-2 font-medium">
                  Top pick instead
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.queries.map((query) => (
                <tr key={query.id} className="align-top">
                  <td className="py-3 pr-4">
                    <p className="font-medium">&ldquo;{query.query}&rdquo;</p>
                    <Badge variant="secondary" className="mt-1">
                      {INTENT_LABELS[query.intent]}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <RunDots mentions={query.mentions} runs={query.runs} />
                  </td>
                  <td className="py-3 pr-4 tabular-nums">
                    {query.bestRank !== null ? `#${query.bestRank}` : "Not listed"}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {query.bestRank === 1 ? "You" : (query.usualLeader ?? "–")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Who Claude recommends instead</CardTitle>
            <CardDescription>
              Businesses that came up most across all {results.totalRuns}{" "}
              answers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.competitors.length ? (
              <ol className="divide-y divide-border">
                {results.competitors.map((competitor) => (
                  <li
                    key={`${competitor.name}-${competitor.website}`}
                    className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                  >
                    <span className="min-w-0 truncate font-medium">
                      {competitor.website ? (
                        <a
                          href={
                            competitor.website.includes("://")
                              ? competitor.website
                              : `https://${competitor.website}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                        >
                          {competitor.name}
                        </a>
                      ) : (
                        competitor.name
                      )}
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {competitor.appearances} answers · avg #
                      {competitor.averageRank.toFixed(1)}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">
                No other businesses were recommended.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Where Claude looked</CardTitle>
            <CardDescription>
              Sites that came up in Claude&apos;s web searches, by how many
              answers found them. Being listed or mentioned on these is how a
              business gets recommended.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.sources.length ? (
              <ol className="divide-y divide-border">
                {results.sources.map((source) => (
                  <li
                    key={source.domain}
                    className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                  >
                    <a
                      href={`https://${source.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-w-0 items-center gap-1.5 truncate font-medium hover:underline"
                    >
                      {source.domain}
                      <ExternalLinkIcon
                        aria-hidden
                        className="size-3 shrink-0 text-muted-foreground"
                      />
                      {source.isOwnSite && (
                        <Badge variant="secondary">Your site</Badge>
                      )}
                    </a>
                    <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {source.answers} answers
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">
                No sources were recorded for these answers.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground">
        AI answers vary from run to run and by person, so treat this as a
        snapshot. It reflects what Claude recommends from a live web search,
        which is close to, but not the same as, what someone sees in the Claude
        app with their own location and history.
      </p>
    </div>
  );
}
