import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { FatalError } from "workflow";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  REVIEW_THEME_CATEGORIES,
  type ReviewThemesStatus,
} from "@/lib/supabase/models";

// Sonnet 5 for both calls: high effort where the theme set gets decided,
// low effort for the per-batch tagging against that fixed list.
const MODEL = "claude-sonnet-5";
// A long review adds little theme signal past this; keeps a 1,000-review
// discovery prompt well inside the context window.
const MAX_REVIEW_CHARS = 1500;
const MAX_THEMES = 10;

interface WrittenReview {
  id: string;
  rating: number | null;
  body: string;
}

async function loadWrittenReviews(
  companyId: string,
  ids?: string[],
): Promise<WrittenReview[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("lead_reviews")
    .select("id, rating, body")
    .eq("company_id", companyId)
    .not("body", "is", null)
    .order("published_at", { ascending: false });
  if (ids) query = query.in("id", ids);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load reviews: ${error.message}`);

  return (data ?? []).filter((r): r is WrittenReview => Boolean(r.body));
}

function reviewXml(review: WrittenReview, id: string) {
  const text = review.body.slice(0, MAX_REVIEW_CHARS);
  return `<review id="${id}" rating="${review.rating ?? "?"}">${text}</review>`;
}

function toKey(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

const DiscoveredThemesSchema = z.object({
  themes: z.array(
    z.object({
      key: z
        .string()
        .describe("Short snake_case handle, e.g. 'billing_clarity'"),
      name: z
        .string()
        .describe("2-4 word display name, e.g. 'Billing clarity'"),
      description: z
        .string()
        .describe(
          "One sentence saying what a review must talk about to belong here",
        ),
      category: z.enum(REVIEW_THEME_CATEGORIES),
    }),
  ),
});

const DISCOVERY_SYSTEM = `You organize a business's customer reviews into themes for the business's leadership.

A theme is a topic customers talk about, not an opinion about it. Name themes neutrally so one theme holds both praise and complaints about the same thing: "Billing clarity", not "Surprise charges"; "Wait times", not "Long waits". The star rating already shows how people feel, so never make a theme about sentiment itself ("Positive experience", "Would recommend").

Choose themes that are specific to this business and its industry, recognizable to the people who run it, and distinct from each other. Prefer fewer, well-populated themes over many thin ones; skip topics only a handful of reviews mention.

Assign each theme the closest shared category:
- people_service: staff, friendliness, bedside manner, professionalism
- price_billing: cost, value, billing, insurance, payment
- scheduling_access: booking, availability, wait times, location convenience
- results_quality: the outcome or quality of the core product or service
- communication: explanations, responsiveness, follow-up
- place_product: the facility, environment, equipment, or the product itself
- other: anything that fits none of the above`;

export async function discoverThemesStep(companyId: string): Promise<number> {
  "use step";

  const supabase = getSupabaseServerClient();
  const { data: company } = await supabase
    .from("lead_companies")
    .select("name, domain, enrichment")
    .eq("id", companyId)
    .single();
  const reviews = await loadWrittenReviews(companyId);

  if (!reviews.length) {
    throw new FatalError("No written reviews to find themes in.");
  }

  const enrichment = company?.enrichment as { business_type?: string } | null;
  const business = [
    company?.name ?? company?.domain,
    enrichment?.business_type,
  ]
    .filter(Boolean)
    .join(", ");

  const client = new Anthropic();
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    system: DISCOVERY_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Business: ${business || "unknown"}

<reviews>
${reviews.map((r, i) => reviewXml(r, String(i))).join("\n")}
</reviews>

Propose between 5 and ${MAX_THEMES} themes for these ${reviews.length} reviews.`,
      },
    ],
    output_config: {
      effort: "high",
      format: zodOutputFormat(DiscoveredThemesSchema),
    },
  });

  if (response.stop_reason === "refusal" || !response.parsed_output) {
    throw new Error(`Theme discovery returned no themes (${response.stop_reason})`);
  }

  // Normalize and dedupe keys; Claude's keys are also the tagging enum.
  const seen = new Set<string>();
  const themes = response.parsed_output.themes
    .map((theme) => ({ ...theme, key: toKey(theme.key || theme.name) }))
    .filter((theme) => theme.key && !seen.has(theme.key) && seen.add(theme.key))
    .slice(0, MAX_THEMES);

  // Replace any previous run's themes (tags cascade), so a retried step
  // doesn't leave duplicates behind.
  const { error: deleteError } = await supabase
    .from("review_themes")
    .delete()
    .eq("company_id", companyId);
  if (deleteError) {
    throw new Error(`Failed to clear old themes: ${deleteError.message}`);
  }

  const { error } = await supabase.from("review_themes").insert(
    themes.map((theme, position) => ({
      company_id: companyId,
      key: theme.key,
      name: theme.name,
      description: theme.description,
      category: theme.category,
      position,
    })),
  );
  if (error) throw new Error(`Failed to save themes: ${error.message}`);

  return themes.length;
}

export async function listWrittenReviewIdsStep(
  companyId: string,
): Promise<string[]> {
  "use step";

  return (await loadWrittenReviews(companyId)).map((review) => review.id);
}

const TAGGING_SYSTEM = `You tag customer reviews with the themes they talk about.

A review gets every theme it meaningfully discusses, and no theme it only brushes past. A review can have several themes, or none if it says nothing specific ("Great place!"). Themes are topics: tag a review about billing with the billing theme whether the customer liked it or not.`;

export async function tagReviewBatchStep(
  companyId: string,
  reviewIds: string[],
): Promise<number> {
  "use step";

  const supabase = getSupabaseServerClient();
  const { data: themes, error: themesError } = await supabase
    .from("review_themes")
    .select("id, key, name, description")
    .eq("company_id", companyId)
    .order("position");
  if (themesError) {
    throw new Error(`Failed to load themes: ${themesError.message}`);
  }
  if (!themes?.length) throw new FatalError("No themes to tag against.");

  const reviews = await loadWrittenReviews(companyId, reviewIds);
  if (!reviews.length) return 0;

  const keys = themes.map((theme) => theme.key) as [string, ...string[]];
  const TagsSchema = z.object({
    reviews: z.array(
      z.object({
        id: z.string(),
        themes: z.array(z.enum(keys)),
      }),
    ),
  });

  const client = new Anthropic();
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    // Classification against a fixed list doesn't need deep reasoning.
    output_config: {
      effort: "low",
      format: zodOutputFormat(TagsSchema),
    },
    system: TAGGING_SYSTEM,
    messages: [
      {
        role: "user",
        content: `<themes>
${themes.map((t) => `- ${t.key}: ${t.name}. ${t.description}`).join("\n")}
</themes>

<reviews>
${reviews.map((r, i) => reviewXml(r, String(i))).join("\n")}
</reviews>

Return every review id with its themes.`,
      },
    ],
  });

  if (response.stop_reason === "refusal" || !response.parsed_output) {
    throw new Error(`Tagging returned no result (${response.stop_reason})`);
  }

  const themeIdByKey = new Map(themes.map((t) => [t.key, t.id]));
  const rows = response.parsed_output.reviews.flatMap((tagged) => {
    const review = reviews[Number(tagged.id)];
    if (!review) return [];
    return [...new Set(tagged.themes)].flatMap((key) => {
      const themeId = themeIdByKey.get(key);
      return themeId ? [{ review_id: review.id, theme_id: themeId }] : [];
    });
  });

  // Replace this batch's tags so a retried step stays idempotent.
  const { error: deleteError } = await supabase
    .from("review_theme_tags")
    .delete()
    .in("review_id", reviews.map((review) => review.id));
  if (deleteError) {
    throw new Error(`Failed to clear old tags: ${deleteError.message}`);
  }

  if (rows.length) {
    const { error } = await supabase.from("review_theme_tags").insert(rows);
    if (error) throw new Error(`Failed to save tags: ${error.message}`);
  }

  return rows.length;
}

export async function setThemesStatusStep(
  companyId: string,
  status: ReviewThemesStatus,
) {
  "use step";

  const supabase = getSupabaseServerClient();
  await supabase
    .from("lead_companies")
    .update({
      review_themes_status: status,
      ...(status === "ready"
        ? { review_themes_updated_at: new Date().toISOString() }
        : {}),
    })
    .eq("id", companyId);
}
