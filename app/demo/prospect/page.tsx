import ElevenLabsWidget from "@/components/demo/prospect/elevenlabs-widget";
import PageTitle from "@/components/demo/shared/page-title";
import { getCurrentLeadCompany } from "@/lib/intake/current-company";

interface CompanyEnrichment {
  about?: string;
  business_type?: string;
  products_services?: string[];
  sells_to?: string;
}

export default async function DemoProspectPage() {
  const company = await getCurrentLeadCompany();
  // Checked during enrichment via X-Frame-Options/CSP frame-ancestors
  // headers (see workflows/enrich-company). null means "not checked yet" -
  // still attempt the iframe optimistically rather than flash a fallback.
  const blocked = company?.embeddable === false;
  const enrichment = company?.enrichment as CompanyEnrichment | undefined;
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  const companyName = company?.name ?? company?.domain ?? undefined;

  return (
    <div className="flex flex-col gap-2">
      <PageTitle>Prospect Intake</PageTitle>

      {company?.domain && !blocked && (
        <p className="text-muted-foreground">
          Live preview of{" "}
          <span className="font-medium text-foreground">
            {company.domain}
          </span>{" "}
          — the AI intake conversation and booking/payment options will float
          on top of this.
        </p>
      )}

      {company ? (
        <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl border border-border">
          {company.domain && !blocked ? (
            <iframe
              src={`https://${company.domain}`}
              title={`${company.domain} preview`}
              className="size-full"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          ) : company.domain && blocked ? (
            <div className="flex size-full flex-col items-center justify-center gap-3 p-8 text-center">
              {company.logo_url && (
                // eslint-disable-next-line @next/next/no-img-element -- external, unoptimized company logo
                <img
                  src={company.logo_url}
                  alt=""
                  className="size-12 rounded-lg border border-border bg-white object-contain p-1"
                />
              )}
              <p className="font-medium">
                {companyName} doesn&apos;t allow its site to be embedded here
              </p>
              <p className="max-w-md text-sm text-muted-foreground">
                {enrichment?.about ??
                  "Their site sets headers (X-Frame-Options/CSP) that block iframing, so we can't preview it live."}
              </p>
            </div>
          ) : (
            <div className="flex size-full items-center justify-center p-8 text-center text-muted-foreground">
              {companyName} didn&apos;t provide a website, so there&apos;s no
              live site to preview here.
            </div>
          )}

          {agentId && (
            <ElevenLabsWidget
              agentId={agentId}
              avatarImageUrl={company.logo_url ?? undefined}
              dynamicVariables={
                enrichment
                  ? {
                      company_name: companyName ?? "",
                      business_type: enrichment.business_type ?? "",
                      products_services:
                        enrichment.products_services?.join(", ") ?? "",
                      sells_to: enrichment.sells_to ?? "",
                      about: enrichment.about ?? "",
                      site_content: company.scraped_content ?? "",
                    }
                  : undefined
              }
            />
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Submit the intake form to see a live preview of your company&apos;s
          site here.
        </p>
      )}
    </div>
  );
}
