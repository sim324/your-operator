import {
  checkEmbeddableStep,
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
    // Only needs the domain, so run it alongside scraping via Promise.all
    // rather than making it its own status/wait.
    const [scraped, embeddable] = await Promise.all([
      scrapeCompanyStep(domain),
      checkEmbeddableStep(domain),
    ]);

    await updateStatusStep(companyId, "structuring");
    const enrichment = await structureCompanyStep(scraped.markdown);

    await updateStatusStep(companyId, "uploading");
    const logoUrl = await uploadLogoStep(companyId, scraped.logoCandidates);

    await saveEnrichmentStep(companyId, {
      logoUrl,
      embeddable,
      enrichment,
      scrapedContent: scraped.markdown,
    });
  } catch (err) {
    await markFailedStep(
      companyId,
      err instanceof Error ? err.message : "Unknown error",
    );
    throw err;
  }
}
