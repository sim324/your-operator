# Google Places API (New): live test against Denver Dream Dentistry

Run on 2026-09-23 with `GOOGLE_PLACES_API_KEY` from `.env.local`. Raw responses are next to this file:

- `google-places-text-search.json`: text search result
- `google-places-details-reviews.json`: place details with reviews

## 1. Text search (find the place)

```
POST https://places.googleapis.com/v1/places:searchText
X-Goog-FieldMask: places.id,places.displayName,places.formattedAddress,places.websiteUri,places.googleMapsUri
{ "textQuery": "Denver Dream Dentistry", "pageSize": 5 }
```

The search returned exactly one result:

| field | value |
|---|---|
| `id` (place_id, safe to store) | `ChIJR1F9Jxx8bIcRZDRbRJEEvKc` |
| `websiteUri` | `https://denverdreamdentistry.com/` (host matches our domain) |
| `googleMapsUri` | `https://maps.google.com/?cid=12086540521919165540&g_mp=…` |
| `formattedAddress` | `820 Clermont St #310, Denver, CO 80220, USA` |
| `displayName` | `{ text, languageCode }` |

Notes:
- The `cid` is the same one embedded in the site's own JSON-LD (`structured-data/`), so both match rules (website host or cid) confirm the place.
- `googleMapsUri` has a `g_mp=` tracking param appended. Strip it before storing as `google_maps_url`, keeping just `https://maps.google.com/?cid=…`.

## 2. Place details with reviews

```
GET https://places.googleapis.com/v1/places/{placeId}?languageCode=en
X-Goog-FieldMask: id,displayName,rating,userRatingCount,googleMapsUri,reviews
```

```ts
{
  id: string;
  displayName: { text: string; languageCode: string };
  rating: number;            // 5 (one decimal in general, e.g. 4.6)
  userRatingCount: number;   // 606
  googleMapsUri: string;
  reviews: Array<{           // max 5, Google's "most relevant" order
    name: string;            // "places/{placeId}/reviews/{reviewId}", unique, use as key
    relativePublishTimeDescription: string; // "2 months ago"
    rating: number;          // 1–5
    text: { text: string; languageCode: string };          // translated to ?languageCode
    originalText: { text: string; languageCode: string };  // as written
    authorAttribution: {
      displayName: string;
      uri: string;           // reviewer's Maps contributor page (required link)
      photoUri: string;      // lh3.googleusercontent.com avatar, 128px
    };
    publishTime: string;     // ISO 8601
    flagContentUri: string;  // "report this review" link
    googleMapsUri: string;   // deep link to the review on Maps
  }>;
}
```

What this place returned: 5 reviews, all 5 stars, published between April and July 2026, 440–890 characters of text each, all in English.

## Takeaways for the UI

- There's no way to page past 5 reviews or sort them by date through this API. Full history, sorting and trends need the Apify actor (later).
- `rating` + `userRatingCount` are the headline numbers. The 5 reviews are a sample, not a feed.
- Review text can be long (~900 chars). Clamp it with a "more" toggle.
- The review's `googleMapsUri` feature id `0x876c7c1c277d5147:0xa7bc0491445b3464` decodes to the same cid (`0xa7bc…` = `12086540521919165540`), which confirms the hex-to-cid decoding in the lookup workflow.
- Attribution to show: the Google Maps credit, plus each author's name linked to `authorAttribution.uri`. `flagContentUri` is optional to show.
- Billing: `reviews` in the field mask puts this call on the Enterprise + Atmosphere SKU, which is the most expensive tier. The text search above is on the Pro SKU because of `websiteUri`.
