import {
  markFailedStep,
  saveEnrichmentStep,
  scrapeCompanyStep,
  structureCompanyStep,
  updateStatusStep,
  uploadLogoStep,
} from "./steps";

export async function enrichCompanyWorkflow(companyId: string, domain: string) {
  "use workflow";

  try {
    await updateStatusStep(companyId, "scraping");
    const scraped = await scrapeCompanyStep(domain);

    await updateStatusStep(companyId, "structuring");
    const enrichment = await structureCompanyStep(scraped.markdown);

    const logoUrl = scraped.logoUrl
      ? await uploadLogoStep(companyId, scraped.logoUrl)
      : null;

    await saveEnrichmentStep(companyId, {
      logoUrl,
      brandColor: scraped.themeColor,
      enrichment,
    });
  } catch (err) {
    await markFailedStep(
      companyId,
      err instanceof Error ? err.message : "Unknown error",
    );
    throw err;
  }
}
