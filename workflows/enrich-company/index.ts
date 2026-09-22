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

    await updateStatusStep(companyId, "uploading");
    const logoUrl = await uploadLogoStep(companyId, scraped.logoCandidates);

    await saveEnrichmentStep(companyId, {
      logoUrl,
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
