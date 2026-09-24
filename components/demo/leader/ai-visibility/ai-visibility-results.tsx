import { ExternalLinkIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import RunAgainButton from "@/components/demo/leader/ai-visibility/run-again-button";
import StatCard from "@/components/demo/leader/stat-card";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AiVisibilityResults } from "@/lib/ai-visibility/results";

const ORDINAL_RULES = new Intl.PluralRules("en-US", { type: "ordinal" });
const ORDINAL_SUFFIXES: Record<Intl.LDMLPluralRule, string> = {
  zero: "th",
  one: "st",
  two: "nd",
  few: "rd",
  many: "th",
  other: "th",
};

// 1 -> "1st", 2 -> "2nd", 11 -> "11th", 23 -> "23rd".
function ordinal(n: number) {
  return `${n}${ORDINAL_SUFFIXES[ORDINAL_RULES.select(n)]}`;
}

// One dot per run: filled when that run recommended the business. The text
// beside it carries the same information, so color isn't the only signal.
function RunDots({ mentions, runs }: { mentions: number; runs: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="tabular-nums">
        {mentions} of {runs}
      </span>
    </span>
  );
}

export default function AiVisibilityResultsView({
  results,
}: {
  results: AiVisibilityResults;
}) {
  const visibility = results.totalRuns
    ? Math.round((results.mentionedRuns / results.totalRuns) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Recommended in" value={`${visibility}%`} />
        <StatCard
          label="Searches you appear in"
          value={`${results.queriesWithMention} of ${results.queries.length}`}
        />
        <StatCard
          label="Average rank"
          value={
            results.averageRank !== null
              ? ordinal(Math.round(results.averageRank))
              : "–"
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-black">
            Searches performed
          </CardTitle>
          <CardDescription>
            Generated from your website&apos;s messaging.
          </CardDescription>
          <CardAction>
            <RunAgainButton />
          </CardAction>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Query
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Mentions
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Position
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
                    <p className="font-medium">{query.query}</p>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <RunDots mentions={query.mentions} runs={query.runs} />
                  </td>
                  <td className="py-3 pr-4 tabular-nums">
                    {query.bestRank !== null ? `#${query.bestRank}` : "--"}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {query.bestRank === 1 ? "You" : (query.usualLeader ?? "--")}
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
            <CardTitle className="text-2xl font-black">
              Recommended instead
            </CardTitle>
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
                      {competitor.appearances} mentions · avg{" "}
                      {ordinal(Math.round(competitor.averageRank))}
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
            <CardTitle className="text-2xl font-black">
              Where Claude looked
            </CardTitle>
            <CardDescription>
              Sites that came up in Claude&apos;s default AI web search tool.
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
        snapshot. It is close to, but not the same as, what someone sees in the
        Claude app with their own location and history.
      </p>
    </div>
  );
}
