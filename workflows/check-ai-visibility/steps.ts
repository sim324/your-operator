import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { FatalError, getStepMetadata } from "workflow";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  AI_VISIBILITY_INTENTS,
  type AiVisibilityBusiness,
  type AiVisibilityCitation,
  type AiVisibilityLocation,
  type AiVisibilityStatus,
} from "@/lib/supabase/models";

// Sonnet 5 writes the queries, like review themes, and answers the searches
// themselves with web search. Parsing an answer is plain extraction, so it
// uses the faster Haiku.
const ANALYSIS_MODEL = "claude-sonnet-5";
const ANSWER_MODEL = "claude-sonnet-5";
const EXTRACTION_MODEL = "claude-haiku-4-5";
const QUERY_COUNT = 5;
const MAX_SITE_CHARS = 15000;
const MAX_SEARCHES_PER_ANSWER = 5;
// A server-tool loop can stop with pause_turn; resume a few times at most.
const MAX_CONTINUATIONS = 4;

// ---------------------------------------------------------------------------
// 1. Write the queries
// ---------------------------------------------------------------------------

const GeneratedQueriesSchema = z.object({
  location: z.object({
    city: z.string().describe("Main city the business serves, e.g. 'Denver'"),
    region: z.string().describe("State or region, e.g. 'Colorado'"),
    country: z.string().describe("ISO 3166-1 alpha-2 country code, e.g. 'US'"),
    timezone: z.string().describe("IANA timezone, e.g. 'America/Denver'"),
  }),
  queries: z.array(
    z.object({
      query: z.string(),
      intent: z.enum(AI_VISIBILITY_INTENTS),
    }),
  ),
});

const QUERY_SYSTEM = `You help a local or specialist business understand whether AI assistants recommend it.

Write the searches a potential customer would type into an AI assistant like ChatGPT or Claude when they need what this business sells, but before they know the business exists. These are the searches the business should show up in.

Rules:
- Never include the business's name, domain, staff names or anything else that identifies it. The point is to test unbranded discovery.
- Target the business's core, highest-value services, not minor ones.
- Write the way people actually talk to an assistant: plain, specific, sometimes a full question.
- "Near me" phrasing is fine; the search runs from the business's city.
- Use a mix of intents:
  - service_location: a service plus the place ("dental implants in Denver")
  - best_near_me: asking for the best or top option nearby
  - problem: describing a need or problem rather than naming a service
  - comparison: a qualifier that narrows the choice (price, insurance, hours, specialty)

Also work out where the business serves customers, from its address, service area or content.`;

export async function generateQueriesStep(companyId: string): Promise<string[]> {
  "use step";

  const supabase = getSupabaseServerClient();
  const { data: company, error } = await supabase
    .from("lead_companies")
    .select("name, domain, enrichment, scraped_content")
    .eq("id", companyId)
    .single();
  if (error || !company) throw new FatalError("Company not found.");
  if (!company.scraped_content && !company.enrichment) {
    throw new FatalError("Nothing known about this company to write queries from.");
  }

  // Review themes, when they exist, say what customers actually value.
  const { data: themes } = await supabase
    .from("review_themes")
    .select("name")
    .eq("company_id", companyId)
    .order("position");

  const client = new Anthropic();
  const response = await client.messages.parse({
    model: ANALYSIS_MODEL,
    max_tokens: 16000,
    system: QUERY_SYSTEM,
    messages: [
      {
        role: "user",
        content: `<business>
Name: ${company.name ?? "unknown"}
Website: ${company.domain ?? "none"}
Profile: ${JSON.stringify(company.enrichment)}
${themes?.length ? `What reviews talk about most: ${themes.map((t) => t.name).join(", ")}` : ""}
</business>

<website_content>
${(company.scraped_content ?? "").slice(0, MAX_SITE_CHARS)}
</website_content>

Write exactly ${QUERY_COUNT} searches, covering at least three of the four intents.`,
      },
    ],
    output_config: {
      effort: "high",
      format: zodOutputFormat(GeneratedQueriesSchema),
    },
  });

  if (response.stop_reason === "refusal" || !response.parsed_output) {
    throw new Error(`Query generation returned nothing (${response.stop_reason})`);
  }

  const { location, queries } = response.parsed_output;
  const picked = queries.slice(0, QUERY_COUNT);

  // Replace a previous run's queries (answers cascade).
  const { error: deleteError } = await supabase
    .from("ai_visibility_queries")
    .delete()
    .eq("company_id", companyId);
  if (deleteError) {
    throw new Error(`Failed to clear old queries: ${deleteError.message}`);
  }

  const { data: inserted, error: insertError } = await supabase
    .from("ai_visibility_queries")
    .insert(
      picked.map((q, position) => ({
        company_id: companyId,
        query: q.query,
        intent: q.intent,
        position,
      })),
    )
    .select("id, position");
  if (insertError || !inserted) {
    throw new Error(`Failed to save queries: ${insertError?.message}`);
  }

  const savedLocation: AiVisibilityLocation = {
    ...location,
    country: location.country.toUpperCase().slice(0, 2),
  };
  await supabase
    .from("lead_companies")
    .update({ ai_visibility_location: { ...savedLocation } })
    .eq("id", companyId);

  return inserted
    .sort((a, b) => a.position - b.position)
    .map((row) => row.id);
}

// ---------------------------------------------------------------------------
// 2. Ask Claude, blind
// ---------------------------------------------------------------------------

// Each attempt re-runs paid web searches; one retry covers a transient
// failure without tripling the bill. This step retry is the only retry: the
// SDK's own is off, or a stalled call would be retried inside the step too.
const ANSWER_MAX_RETRIES = 1;
// Answers stream, and a call that goes this long without a single event is
// treated as stalled. Healthy answers go at most ~5s between events (mostly
// while a search runs), so this catches a hang without cutting off a slow
// but working answer.
const ANSWER_IDLE_TIMEOUT_MS = 30_000;
// Search results can run to dozens of URLs per answer; keep the most useful.
const MAX_SOURCES_PER_ANSWER = 20;

interface ClaudeAnswer {
  model: string;
  answer: string;
  sources: AiVisibilityCitation[];
}

// One streamed turn, aborted once it goes ANSWER_IDLE_TIMEOUT_MS without an
// event. The SDK's own timeout only covers the wait for response headers on a
// stream, so it can't catch a stream that stalls partway.
async function streamTurn(
  client: Anthropic,
  params: Anthropic.MessageStreamParams,
): Promise<Anthropic.Message> {
  const controller = new AbortController();
  let timer = setTimeout(() => controller.abort(), ANSWER_IDLE_TIMEOUT_MS);
  const stream = client.messages.stream(params, { signal: controller.signal });
  stream.on("streamEvent", () => {
    clearTimeout(timer);
    timer = setTimeout(() => controller.abort(), ANSWER_IDLE_TIMEOUT_MS);
  });
  try {
    return await stream.finalMessage();
  } catch (err) {
    if (controller.signal.aborted) {
      throw new Error(`Stalled: no response for ${ANSWER_IDLE_TIMEOUT_MS / 1000}s`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// The answering call knows only the customer's question and where they are
// searching from (the business's city, as the Claude app knows its user's
// location). Nothing about the business itself, so the ranking isn't biased
// toward it.
async function askClaude(
  question: string,
  location: AiVisibilityLocation | null,
): Promise<ClaudeAnswer> {
  const client = new Anthropic({ maxRetries: 0 });
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: question },
  ];
  // Every turn's content: a resumed (pause_turn) turn continues the same
  // answer, so text and sources are read across all of them.
  const content: Anthropic.ContentBlock[] = [];

  let response: Anthropic.Message | null = null;
  for (let turn = 0; turn <= MAX_CONTINUATIONS; turn++) {
    response = await streamTurn(client, {
      model: ANSWER_MODEL,
      max_tokens: 16000,
      // Without this, "near me" searches get "what's your location?" back.
      ...(location
        ? {
            system: `The user is in ${location.city}, ${location.region}, ${location.country}.`,
          }
        : {}),
      tools: [
        {
          type: "web_search_20260209",
          name: "web_search",
          max_uses: MAX_SEARCHES_PER_ANSWER,
          ...(location
            ? {
                user_location: {
                  type: "approximate" as const,
                  city: location.city,
                  region: location.region,
                  country: location.country,
                  timezone: location.timezone,
                },
              }
            : {}),
        },
      ],
      messages,
    });
    content.push(...response.content);

    if (response.stop_reason !== "pause_turn") break;
    // Resume the server-side search loop: re-send with the paused turn.
    messages.push({ role: "assistant", content: response.content });
  }

  // A refusal fails the attempt rather than counting as "not mentioned",
  // which would skew the score.
  if (!response || response.stop_reason === "refusal") {
    throw new Error(`No answer (${response?.stop_reason ?? "no response"})`);
  }

  // Sources: this web search version filters results in code before Claude
  // reads them, so answers usually carry no inline citations. The search
  // result blocks list what each search returned; keep inline citations too
  // in case they're present.
  let answer = "";
  const sources = new Map<string, AiVisibilityCitation>();
  for (const block of content) {
    if (block.type === "text") {
      answer += block.text;
      for (const citation of block.citations ?? []) {
        if (citation.type === "web_search_result_location") {
          sources.set(citation.url, {
            url: citation.url,
            title: citation.title ?? null,
          });
        }
      }
    } else if (
      block.type === "web_search_tool_result" &&
      Array.isArray(block.content)
    ) {
      for (const result of block.content) {
        if (!sources.has(result.url)) {
          sources.set(result.url, { url: result.url, title: result.title });
        }
      }
    }
  }

  return {
    model: response.model,
    answer: answer.trim(),
    sources: [...sources.values()].slice(0, MAX_SOURCES_PER_ANSWER),
  };
}

export interface AnswerOutcome {
  answerId: string;
  // True when every attempt failed; the answer is recorded with its error
  // and left out of the score instead of failing the whole check.
  failed: boolean;
}

export async function answerQueryStep(
  companyId: string,
  queryId: string,
  attempt: number,
): Promise<AnswerOutcome> {
  "use step";

  const supabase = getSupabaseServerClient();
  const [{ data: query }, { data: company }] = await Promise.all([
    supabase
      .from("ai_visibility_queries")
      .select("query")
      .eq("id", queryId)
      .single(),
    supabase
      .from("lead_companies")
      .select("ai_visibility_location")
      .eq("id", companyId)
      .single(),
  ]);
  if (!query) throw new FatalError(`Query ${queryId} not found.`);

  const location = company?.ai_visibility_location as AiVisibilityLocation | null;

  let result: ClaudeAnswer | null = null;
  let failure: string | null = null;
  try {
    result = await askClaude(query.query, location);
  } catch (err) {
    // Not the last try: throw so the step retries.
    if (getStepMetadata().attempt <= ANSWER_MAX_RETRIES) throw err;
    failure = err instanceof Error ? err.message : String(err);
  }

  const { data: saved, error } = await supabase
    .from("ai_visibility_answers")
    .upsert(
      {
        query_id: queryId,
        company_id: companyId,
        attempt,
        model: result?.model ?? null,
        answer: result?.answer ?? null,
        citations: (result?.sources ?? []).map((c) => ({ ...c })),
        error: failure,
        businesses: null,
        mentioned: null,
        rank: null,
      },
      { onConflict: "query_id,attempt" },
    )
    .select("id")
    .single();
  if (error || !saved) throw new Error(`Failed to save answer: ${error?.message}`);

  return { answerId: saved.id, failed: failure !== null };
}

answerQueryStep.maxRetries = ANSWER_MAX_RETRIES;

// ---------------------------------------------------------------------------
// 3. Parse the answer
// ---------------------------------------------------------------------------

const ExtractionSchema = z.object({
  businesses: z.array(
    z.object({
      name: z.string(),
      website: z
        .string()
        .nullable()
        .describe("The business's own website if the answer gives one"),
    }),
  ),
  target_position: z
    .number()
    .int()
    .nullable()
    .describe(
      "1-based position of the target business in `businesses`, or null if it isn't there",
    ),
});

const EXTRACTION_SYSTEM = `You read an AI assistant's answer to a customer's search and list the businesses it recommended or presented as options, in the order they appear.

Include only actual businesses the customer could go to. Leave out websites used as sources (Yelp, Google, Healthgrades, review sites, directories, news) unless the answer presents them as the provider. Count each business once, at its first appearance.

Then say whether a given target business is among them. Match on meaning, not exact spelling: a shortened name, a different capitalisation or the same website counts as the target.`;

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

export async function extractAnswerStep(answerId: string) {
  "use step";

  const supabase = getSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("ai_visibility_answers")
    .select("answer, company_id")
    .eq("id", answerId)
    .single();
  if (error || !row) throw new FatalError(`Answer ${answerId} not found.`);

  const { data: company } = await supabase
    .from("lead_companies")
    .select("name, domain")
    .eq("id", row.company_id)
    .single();

  let businesses: AiVisibilityBusiness[] = [];
  let rank: number | null = null;

  if (row.answer) {
    const client = new Anthropic();
    const response = await client.messages.parse({
      model: EXTRACTION_MODEL,
      max_tokens: 8000,
      system: EXTRACTION_SYSTEM,
      messages: [
        {
          role: "user",
          content: `<target_business>
Name: ${company?.name ?? "unknown"}
Website: ${company?.domain ?? "unknown"}
</target_business>

<answer>
${row.answer}
</answer>`,
        },
      ],
      output_config: {
        format: zodOutputFormat(ExtractionSchema),
      },
    });

    if (response.stop_reason === "refusal" || !response.parsed_output) {
      throw new Error(`Answer parsing returned nothing (${response.stop_reason})`);
    }

    businesses = response.parsed_output.businesses;
    const position = response.parsed_output.target_position;
    rank =
      position && position >= 1 && position <= businesses.length
        ? position
        : null;

    // Backstop the model's match with a plain website comparison.
    if (rank === null && company?.domain) {
      const index = businesses.findIndex(
        (b) => hostOf(b.website)?.endsWith(company.domain!) ?? false,
      );
      if (index >= 0) rank = index + 1;
    }
  }

  const { error: updateError } = await supabase
    .from("ai_visibility_answers")
    .update({
      businesses: businesses.map((b) => ({ ...b })),
      mentioned: rank !== null,
      rank,
    })
    .eq("id", answerId);
  if (updateError) {
    throw new Error(`Failed to save parsed answer: ${updateError.message}`);
  }
}

export async function setVisibilityStatusStep(
  companyId: string,
  status: AiVisibilityStatus,
) {
  "use step";

  const supabase = getSupabaseServerClient();
  await supabase
    .from("lead_companies")
    .update({
      ai_visibility_status: status,
      // When the status last changed: the "Checked" date once ready, and
      // how the page tells a stuck run from a slow one before that.
      ai_visibility_updated_at: new Date().toISOString(),
    })
    .eq("id", companyId);
}
