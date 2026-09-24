import {
  findPlaceStep,
  markGooglePlaceFailedStep,
  saveGooglePlaceStep,
  scrapeMapsSignalsStep,
} from "./steps";

// Started from the leader page's "Find Google reviews" button (see
// lib/reviews/actions.ts), separately from company enrichment. The caller
// has already set google_place_status to "searching".
export async function findGooglePlaceWorkflow(
  companyId: string,
  domain: string,
  name: string | null,
) {
  "use workflow";

  try {
    const signals = await scrapeMapsSignalsStep(domain);
    const place = await findPlaceStep({ domain, name, signals });

    await saveGooglePlaceStep(companyId, {
      status: place ? "found" : "not_found",
      placeId: place?.placeId ?? null,
      // Prefer Places' canonical cid URL (what the Apify actor takes); fall
      // back to whatever the site linked so a not_found still keeps a lead.
      mapsUrl: place?.mapsUrl ?? signals.mapsUrl,
    });
  } catch (err) {
    await markGooglePlaceFailedStep(companyId);
    throw err;
  }
}
