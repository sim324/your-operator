import { firecrawlRequest } from "@/lib/firecrawl/request";
import {
  getPlaceBasics,
  searchPlacesByText,
  type PlaceSearchResult,
} from "@/lib/google-places/client";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { GooglePlaceStatus } from "@/lib/supabase/models";

// What the company's own site says about its Google listing. Any of these
// can be missing; the Places search below works from whatever is present.
export interface MapsSignals {
  mapsUrl: string | null;
  placeId: string | null;
  cid: string | null;
  address: string | null;
}

const MAPS_URL_PATTERN =
  /https?:\/\/(?:(?:www\.|maps\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps|g\.page)[^"'\s<>\\)]*/gi;
const SHORT_MAPS_URL_PATTERN = /^https?:\/\/(?:maps\.app\.goo\.gl|goo\.gl\/maps|g\.page)/i;
const PLACE_ID_PATTERN = /(?:query_place_id|place_id)[=:]([A-Za-z0-9_-]{20,})/;
const CID_PATTERN = /[?&](?:cid|ludocid)=(\d{5,})/;
// Embeds and /maps/place/ URLs carry a feature id "0x<hex>:0x<hex>" whose
// second half is the place's cid in hex. Embeds URL-encode the colon.
const FEATURE_ID_PATTERN = /0x[0-9a-f]+(?::|%3A)0x([0-9a-f]+)/i;
const CONTACT_PAGE_PATTERN = /\/(contact|contact-us|location|locations|directions|find-us|visit)(\/|$)/i;

// WordPress writes "&" as "&#038;", JSON-in-HTML as "\u0026", and escapes
// slashes; normalize all of them so the query-param patterns match.
function decodeHtml(value: string) {
  return value
    .replace(/&amp;|&#0*38;/g, "&")
    .replace(/\\u0026/g, "&")
    .replace(/\\\//g, "/");
}

function signalsFromText(text: string): Omit<MapsSignals, "address"> {
  const decoded = decodeHtml(text);
  const mapsUrls = [...decoded.matchAll(MAPS_URL_PATTERN)].map((m) => m[0]);

  const featureHex = decoded.match(FEATURE_ID_PATTERN)?.[1];

  return {
    mapsUrl: mapsUrls[0] ?? null,
    placeId: decoded.match(PLACE_ID_PATTERN)?.[1] ?? null,
    cid:
      decoded.match(CID_PATTERN)?.[1] ??
      (featureHex ? BigInt(`0x${featureHex}`).toString() : null),
  };
}

// Pulled from JSON-LD PostalAddress fields, to disambiguate multi-location
// names in the text search ("Smile Dental" alone matches dozens of places).
function addressFromHtml(html: string): string | null {
  const field = (key: string) =>
    html.match(new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`))?.[1]?.trim();

  const parts = [
    field("streetAddress"),
    field("addressLocality"),
    field("addressRegion"),
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : null;
}

// maps.app.goo.gl / g.page links carry no ids themselves; the page they
// redirect to does.
async function resolveShortMapsUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    return response.url || url;
  } catch {
    return url;
  }
}

async function scrapeRawHtml(url: string): Promise<string> {
  const result = (await firecrawlRequest("/scrape", {
    url,
    formats: ["rawHtml"],
  })) as { data?: { rawHtml?: string } };

  return result.data?.rawHtml ?? "";
}

export async function scrapeMapsSignalsStep(
  domain: string,
): Promise<MapsSignals> {
  "use step";

  const homepageUrl = `https://${domain}`;
  let html = await scrapeRawHtml(homepageUrl);
  let signals = signalsFromText(html);

  // The homepage often has no map; a contact/location page usually does.
  if (!signals.placeId && !signals.cid) {
    const mapResult = (await firecrawlRequest("/map", {
      url: homepageUrl,
    })) as { links?: string[] };
    const contactUrl = mapResult.links?.find((link) =>
      CONTACT_PAGE_PATTERN.test(link),
    );

    if (contactUrl) {
      const contactHtml = await scrapeRawHtml(contactUrl);
      const contactSignals = signalsFromText(contactHtml);
      html = `${html}\n${contactHtml}`;
      signals = {
        mapsUrl: signals.mapsUrl ?? contactSignals.mapsUrl,
        placeId: contactSignals.placeId,
        cid: contactSignals.cid,
      };
    }
  }

  if (
    signals.mapsUrl &&
    !signals.placeId &&
    !signals.cid &&
    SHORT_MAPS_URL_PATTERN.test(signals.mapsUrl)
  ) {
    const resolved = signalsFromText(await resolveShortMapsUrl(signals.mapsUrl));
    signals = { ...signals, placeId: resolved.placeId, cid: resolved.cid };
  }

  return { ...signals, address: addressFromHtml(html) };
}

function hostMatchesDomain(uri: string | undefined, domain: string) {
  if (!uri) return false;
  try {
    const host = new URL(uri).hostname.toLowerCase().replace(/^www\./, "");
    return host === domain || host.endsWith(`.${domain}`);
  } catch {
    return false;
  }
}

// Places appends a per-call "g_mp" tracking param; the stored URL should be
// the stable "https://maps.google.com/?cid=…" form.
function canonicalMapsUrl(uri: string | undefined): string | null {
  if (!uri) return null;
  try {
    const url = new URL(uri);
    url.searchParams.delete("g_mp");
    return url.toString();
  } catch {
    return uri;
  }
}

function cidOf(place: PlaceSearchResult) {
  return place.googleMapsUri?.match(CID_PATTERN)?.[1] ?? null;
}

export interface FoundPlace {
  placeId: string;
  mapsUrl: string | null;
}

// Waterfall, cheapest and most certain first:
// 1. The site links a place_id directly: trust it (the business linked it).
// 2. Text search on name + address, then name, then the bare domain. Only
//    accept a result whose website is this domain, or whose cid matches the
//    one scraped from the site. Never guess: a wrong listing is worse than
//    none.
export async function findPlaceStep(input: {
  domain: string;
  name: string | null;
  signals: MapsSignals;
}): Promise<FoundPlace | null> {
  "use step";

  const { domain, name, signals } = input;

  if (signals.placeId) {
    const place = await getPlaceBasics(signals.placeId);
    return { placeId: place.id, mapsUrl: canonicalMapsUrl(place.googleMapsUri) };
  }

  const queries = [
    name && signals.address ? `${name}, ${signals.address}` : null,
    name,
    domain,
  ].filter((query, index, all): query is string =>
    Boolean(query) && all.indexOf(query) === index,
  );

  for (const query of queries) {
    const places = await searchPlacesByText(query);
    const match = places.find(
      (place) =>
        hostMatchesDomain(place.websiteUri, domain) ||
        (signals.cid !== null && cidOf(place) === signals.cid),
    );

    if (match) {
      return { placeId: match.id, mapsUrl: canonicalMapsUrl(match.googleMapsUri) };
    }
  }

  return null;
}

export async function saveGooglePlaceStep(
  companyId: string,
  result: {
    status: GooglePlaceStatus;
    placeId: string | null;
    mapsUrl: string | null;
  },
) {
  "use step";

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("lead_companies")
    .update({
      google_place_status: result.status,
      google_place_id: result.placeId,
      google_maps_url: result.mapsUrl,
    })
    .eq("id", companyId);

  if (error) {
    throw new Error(`Failed to save Google place: ${error.message}`);
  }
}

export async function markGooglePlaceFailedStep(companyId: string) {
  "use step";

  const supabase = getSupabaseServerClient();
  const status: GooglePlaceStatus = "failed";
  await supabase
    .from("lead_companies")
    .update({ google_place_status: status })
    .eq("id", companyId);
}
