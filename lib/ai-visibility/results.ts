import "server-only";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AiVisibilityBusiness,
  AiVisibilityCitation,
  AiVisibilityIntent,
} from "@/lib/supabase/models";

const TOP_COMPETITORS = 8;
const TOP_SOURCES = 10;

export interface QueryResult {
  id: string;
  query: string;
  intent: AiVisibilityIntent;
  // Answered runs (failed ones excluded)
  runs: number;
  // Runs where the business was recommended
  mentions: number;
  bestRank: number | null;
  // Most common #1 across the runs when it wasn't us
  usualLeader: string | null;
}

export interface Competitor {
  name: string;
  website: string | null;
  // Answers that recommended it
  appearances: number;
  averageRank: number;
}

export interface CitedSource {
  domain: string;
  // Answers whose searches surfaced it
  answers: number;
  isOwnSite: boolean;
}

export interface AiVisibilityResults {
  // Answers that came back and were parsed; the score is out of these
  totalRuns: number;
  // Answers that failed even after a retry, left out of the score
  failedRuns: number;
  mentionedRuns: number;
  queriesWithMention: number;
  averageRank: number | null;
  queries: QueryResult[];
  competitors: Competitor[];
  sources: CitedSource[];
}

function hostOf(url: string | null | undefined) {
  if (!url) return null;
  try {
    return new URL(url.includes("://") ? url : `https://${url}`).hostname
      .toLowerCase()
      .replace(/^www\./, "");
  } catch {
    return null;
  }
}

// Same business named slightly differently across answers should count once:
// key on its website when the answer gave one, else a normalized name.
function businessKey(business: AiVisibilityBusiness) {
  return (
    hostOf(business.website) ??
    business.name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
  );
}

export async function getAiVisibilityResults(
  companyId: string,
  ownDomain: string | null,
): Promise<AiVisibilityResults> {
  const supabase = getSupabaseServerClient();
  const [{ data: queries, error: queriesError }, { data: answers, error: answersError }] =
    await Promise.all([
      supabase
        .from("ai_visibility_queries")
        .select("id, query, intent")
        .eq("company_id", companyId)
        .order("position"),
      supabase
        .from("ai_visibility_answers")
        .select("query_id, mentioned, rank, businesses, citations, error")
        .eq("company_id", companyId),
    ]);

  if (queriesError) throw new Error(`Failed to load queries: ${queriesError.message}`);
  if (answersError) throw new Error(`Failed to load answers: ${answersError.message}`);

  const failedRuns = (answers ?? []).filter((a) => a.error !== null).length;
  const parsed = (answers ?? [])
    .filter((answer) => answer.error === null)
    .map((answer) => ({
      queryId: answer.query_id,
      mentioned: answer.mentioned === true,
      rank: answer.rank,
      businesses: (answer.businesses ?? []) as unknown as AiVisibilityBusiness[],
      sources: (answer.citations ?? []) as unknown as AiVisibilityCitation[],
    }));

  const queryResults = (queries ?? []).map((query): QueryResult => {
    const runs = parsed.filter((a) => a.queryId === query.id);
    const ranks = runs
      .map((a) => a.rank)
      .filter((rank): rank is number => rank !== null);

    const leaders = new Map<string, number>();
    for (const run of runs) {
      const first = run.businesses[0];
      if (first && run.rank !== 1) {
        leaders.set(first.name, (leaders.get(first.name) ?? 0) + 1);
      }
    }
    const usualLeader =
      [...leaders.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      id: query.id,
      query: query.query,
      intent: query.intent as AiVisibilityIntent,
      runs: runs.length,
      mentions: runs.filter((a) => a.mentioned).length,
      bestRank: ranks.length ? Math.min(...ranks) : null,
      usualLeader,
    };
  });

  // Competitors: every recommended business except us, counted once per
  // answer.
  const competitors = new Map<
    string,
    { name: string; website: string | null; ranks: number[] }
  >();
  for (const answer of parsed) {
    answer.businesses.forEach((business, index) => {
      if (answer.rank === index + 1) return;
      const key = businessKey(business);
      const entry = competitors.get(key) ?? {
        name: business.name,
        website: business.website,
        ranks: [],
      };
      entry.ranks.push(index + 1);
      entry.website ??= business.website;
      competitors.set(key, entry);
    });
  }

  // Sources: domains that came up in each answer's web searches (and any
  // inline citations), counted once per answer.
  const sources = new Map<string, number>();
  for (const answer of parsed) {
    const domains = new Set(
      answer.sources
        .map((c) => hostOf(c.url))
        .filter((d): d is string => d !== null),
    );
    for (const domain of domains) {
      sources.set(domain, (sources.get(domain) ?? 0) + 1);
    }
  }

  const mentionedRanks = parsed
    .map((a) => a.rank)
    .filter((rank): rank is number => rank !== null);

  return {
    totalRuns: parsed.length,
    failedRuns,
    mentionedRuns: parsed.filter((a) => a.mentioned).length,
    queriesWithMention: queryResults.filter((q) => q.mentions > 0).length,
    averageRank: mentionedRanks.length
      ? mentionedRanks.reduce((sum, r) => sum + r, 0) / mentionedRanks.length
      : null,
    queries: queryResults,
    competitors: [...competitors.values()]
      .map((c) => ({
        name: c.name,
        website: c.website,
        appearances: c.ranks.length,
        averageRank: c.ranks.reduce((sum, r) => sum + r, 0) / c.ranks.length,
      }))
      .sort((a, b) => b.appearances - a.appearances || a.averageRank - b.averageRank)
      .slice(0, TOP_COMPETITORS),
    sources: [...sources.entries()]
      .map(([domain, count]) => ({
        domain,
        answers: count,
        isOwnSite: Boolean(
          ownDomain && (domain === ownDomain || domain.endsWith(`.${ownDomain}`)),
        ),
      }))
      .sort((a, b) => b.answers - a.answers)
      .slice(0, TOP_SOURCES),
  };
}
