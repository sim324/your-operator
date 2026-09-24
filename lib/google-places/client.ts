import { FatalError, RetryableError } from "workflow";

// Places API (New). Billing is per SKU and the SKU is picked by the field
// mask, so each call asks for the fewest fields it needs: `reviews` bumps a
// details call to the priciest (Enterprise + Atmosphere) tier, so only the
// leader page render asks for it.
const PLACES_BASE_URL = "https://places.googleapis.com/v1";

export interface PlaceSearchResult {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  websiteUri?: string;
  // e.g. "https://maps.google.com/?cid=12086540521919165540"
  googleMapsUri?: string;
}

export interface PlaceReview {
  name: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text: string; languageCode?: string };
  publishTime?: string;
  googleMapsUri?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

export interface PlaceReviews {
  id: string;
  displayName?: { text: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlaceReview[];
}

function placesHeaders(fieldMask: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    throw new FatalError("GOOGLE_PLACES_API_KEY is not set.");
  }

  return {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": fieldMask,
  };
}

async function parsePlacesResponse(response: Response, label: string) {
  if (response.status === 429) {
    throw new RetryableError(`Places ${label} rate limited`, {
      retryAfter: 30_000,
    });
  }

  // Bad key, API not enabled, billing off, malformed request: retrying
  // won't help, and a bad key would otherwise burn three attempts.
  if (response.status >= 400 && response.status < 500) {
    const body = await response.text();
    throw new FatalError(
      `Places ${label} rejected the request (${response.status}): ${body.slice(0, 300)}`,
    );
  }

  if (!response.ok) {
    throw new Error(`Places ${label} failed with status ${response.status}`);
  }

  return response.json();
}

export async function searchPlacesByText(
  textQuery: string,
): Promise<PlaceSearchResult[]> {
  const response = await fetch(`${PLACES_BASE_URL}/places:searchText`, {
    method: "POST",
    headers: placesHeaders(
      "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.googleMapsUri",
    ),
    body: JSON.stringify({ textQuery, pageSize: 5 }),
  });

  const data = (await parsePlacesResponse(response, "text search")) as {
    places?: PlaceSearchResult[];
  };
  return data.places ?? [];
}

export async function getPlaceBasics(
  placeId: string,
): Promise<PlaceSearchResult> {
  const response = await fetch(
    `${PLACES_BASE_URL}/places/${encodeURIComponent(placeId)}`,
    { headers: placesHeaders("id,displayName,googleMapsUri") },
  );

  return parsePlacesResponse(response, "details");
}

// Not stored (Google's terms), so this runs on every leader page render. The
// hour of Next data cache keeps reloads from re-billing the reviews SKU.
export async function getPlaceReviews(placeId: string): Promise<PlaceReviews> {
  const response = await fetch(
    `${PLACES_BASE_URL}/places/${encodeURIComponent(placeId)}?languageCode=en`,
    {
      headers: placesHeaders(
        "id,displayName,rating,userRatingCount,googleMapsUri,reviews",
      ),
      next: { revalidate: 3600 },
    },
  );

  return parsePlacesResponse(response, "reviews");
}
