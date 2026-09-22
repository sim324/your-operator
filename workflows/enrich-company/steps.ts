import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { FatalError, RetryableError } from "workflow";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  LeadCompanySource,
  LeadCompanyStatus,
} from "@/lib/supabase/models";

const FIRECRAWL_BASE_URL = "https://api.firecrawl.dev/v1";
const SOURCE_FIRECRAWL: LeadCompanySource = "firecrawl";
const STATUS_ENRICHED: LeadCompanyStatus = "enriched";
const STATUS_FAILED: LeadCompanyStatus = "failed";

// Only used to classify Firecrawl's response, not to auth other calls.
function firecrawlHeaders() {
  return {
    Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
    "Content-Type": "application/json",
  };
}

async function firecrawlRequest(path: string, body: unknown) {
  const response = await fetch(`${FIRECRAWL_BASE_URL}${path}`, {
    method: "POST",
    headers: firecrawlHeaders(),
    body: JSON.stringify(body),
  });

  if (response.status === 429) {
    const retryAfterSeconds = Number(response.headers.get("retry-after"));
    const retryAfterMs =
      Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
        ? retryAfterSeconds * 1000
        : 30_000;
    throw new RetryableError("Firecrawl rate limited", {
      retryAfter: retryAfterMs,
    });
  }

  if (response.status === 404 || response.status === 400) {
    throw new FatalError(
      `Firecrawl ${path} rejected the request (${response.status})`,
    );
  }

  if (!response.ok) {
    throw new Error(`Firecrawl ${path} failed with status ${response.status}`);
  }

  return response.json();
}

// Best-to-worst candidates for a square, brand-representative logo image.
// apple-touch-icon is usually a clean high-res square PNG; a generic <link
// rel="icon"> can point at anything, so prefer the largest declared size;
// /favicon.ico and ogImage (often a large marketing banner, not a logo) are
// last resorts. The caller tries each in order until one actually fetches as
// an image.
function extractLogoCandidates(
  html: string | undefined,
  pageUrl: string,
  ogImage: string | undefined,
): string[] {
  const candidates: { href: string; rank: number; size: number }[] = [];

  if (html) {
    const linkTagPattern = /<link\b[^>]*>/gi;
    for (const [tag] of html.matchAll(linkTagPattern)) {
      const relMatch = tag.match(/rel=["']([^"']+)["']/i);
      const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
      if (!relMatch || !hrefMatch) continue;

      const rel = relMatch[1].toLowerCase();
      const isAppleTouchIcon = rel.includes("apple-touch-icon");
      const isIcon = rel === "icon" || rel === "shortcut icon";
      if (!isAppleTouchIcon && !isIcon) continue;

      const sizeMatch = tag.match(/sizes=["'](\d+)x\d+["']/i);
      const size = sizeMatch ? Number(sizeMatch[1]) : 0;

      try {
        const href = new URL(hrefMatch[1], pageUrl).toString();
        candidates.push({ href, rank: isAppleTouchIcon ? 0 : 1, size });
      } catch {
        // Ignore unparsable hrefs (e.g. data: URIs mangled by regex capture).
      }
    }
  }

  candidates.sort((a, b) => a.rank - b.rank || b.size - a.size);

  const ordered = candidates.map((c) => c.href);
  ordered.push(new URL("/favicon.ico", pageUrl).toString());
  if (ogImage) ordered.push(ogImage);

  return [...new Set(ordered)];
}

export async function scrapeCompanyStep(domain: string) {
  "use step";

  const homepageUrl = `https://${domain}`;

  const mapResult = (await firecrawlRequest("/map", { url: homepageUrl })) as {
    links?: string[];
  };

  const aboutUrl = mapResult.links?.find((link) =>
    /\/(about|about-us|company)(\/|$)/i.test(link),
  );
  const pagesToScrape = [homepageUrl, aboutUrl].filter(
    (url): url is string => Boolean(url),
  );

  const scrapes = await Promise.all(
    pagesToScrape.map((url) =>
      firecrawlRequest("/scrape", { url, formats: ["markdown", "html"] }).then(
        (result) =>
          result as {
            data?: {
              markdown?: string;
              html?: string;
              metadata?: { ogImage?: string; favicon?: string };
            };
          },
      ),
    ),
  );

  const markdown = scrapes
    .map((s) => s.data?.markdown)
    .filter((md): md is string => Boolean(md))
    .join("\n\n---\n\n");

  if (!markdown.trim()) {
    throw new FatalError(`Firecrawl returned no content for ${domain}`);
  }

  const home = scrapes[0]?.data;

  return {
    markdown: markdown.slice(0, 15000),
    logoCandidates: extractLogoCandidates(
      home?.html,
      homepageUrl,
      home?.metadata?.ogImage,
    ),
  };
}

const CompanyInfoSchema = z.object({
  business_type: z
    .string()
    .describe("e.g. 'B2B SaaS', 'e-commerce', 'professional services'"),
  products_services: z
    .array(z.string())
    .describe("Short list of what they sell"),
  sells_to: z.string().describe("Who their customers are"),
  about: z.string().describe("One or two sentence summary of the company"),
});

export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;

export async function structureCompanyStep(
  markdown: string,
): Promise<CompanyInfo> {
  "use step";

  const anthropic = new Anthropic();

  const response = await anthropic.messages.parse({
    model: "claude-sonnet-5",
    max_tokens: 4096,
    system:
      "You extract structured company information from scraped website content. Be concise and factual. If something isn't stated explicitly, make a reasonable inference from context rather than leaving a field empty.",
    messages: [
      {
        role: "user",
        content: `Scraped website content (markdown):\n\n${markdown}`,
      },
    ],
    output_config: {
      format: zodOutputFormat(CompanyInfoSchema),
    },
  });

  if (!response.parsed_output) {
    throw new Error("Failed to parse structured company info from model output");
  }

  return response.parsed_output;
}

export async function uploadLogoStep(
  companyId: string,
  logoCandidates: string[],
): Promise<string | null> {
  "use step";

  for (const candidateUrl of logoCandidates) {
    const response = await fetch(candidateUrl).catch(() => null);
    const contentType = response?.headers.get("content-type") ?? "";
    if (!response?.ok || !contentType.startsWith("image/")) continue;

    const bytes = Buffer.from(await response.arrayBuffer());
    const extension = contentType.includes("svg")
      ? "svg"
      : contentType.includes("icon")
        ? "ico"
        : contentType.includes("jpeg")
          ? "jpg"
          : "png";
    const path = `${companyId}.${extension}`;

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.storage
      .from("lead-logos")
      .upload(path, bytes, { contentType, upsert: true });

    if (error) {
      throw new Error(`Failed to upload logo: ${error.message}`);
    }

    return supabase.storage.from("lead-logos").getPublicUrl(path).data
      .publicUrl;
  }

  return null;
}

export async function updateStatusStep(
  companyId: string,
  status: LeadCompanyStatus,
) {
  "use step";

  const supabase = getSupabaseServerClient();
  await supabase.from("lead_companies").update({ status }).eq("id", companyId);
}

export async function saveEnrichmentStep(
  companyId: string,
  result: {
    logoUrl: string | null;
    enrichment: CompanyInfo;
  },
) {
  "use step";

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("lead_companies")
    .update({
      logo_url: result.logoUrl,
      enrichment: result.enrichment,
      status: STATUS_ENRICHED,
      source: SOURCE_FIRECRAWL,
    })
    .eq("id", companyId);

  if (error) {
    throw new Error(`Failed to save enrichment: ${error.message}`);
  }
}

export async function markFailedStep(companyId: string, message: string) {
  "use step";

  const supabase = getSupabaseServerClient();
  await supabase
    .from("lead_companies")
    .update({ status: STATUS_FAILED, enrichment: { error: message } })
    .eq("id", companyId);
}
