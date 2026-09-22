import PageTitle from "@/components/demo/shared/page-title";
import { getCurrentLeadCompany } from "@/lib/intake/current-company";

export default async function DemoProspectPage() {
  const company = await getCurrentLeadCompany();

  return (
    <div className="flex flex-col gap-2">
      <PageTitle>Prospect Intake</PageTitle>

      {company?.domain ? (
        <>
          <p className="text-muted-foreground">
            Live preview of{" "}
            <span className="font-medium text-foreground">
              {company.domain}
            </span>{" "}
            — the AI intake conversation and booking/payment options will
            float on top of this.
          </p>
          <div className="h-[70vh] w-full overflow-hidden rounded-2xl border border-border">
            <iframe
              src={`https://${company.domain}`}
              title={`${company.domain} preview`}
              className="size-full"
              // Some sites block embedding entirely (X-Frame-Options/CSP
              // frame-ancestors) - that shows as a blank frame with no
              // JS-visible error, not something we can detect and fall back
              // from client-side.
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </>
      ) : company ? (
        <p className="text-muted-foreground">
          {company.name ?? "This company"} didn&apos;t provide a website, so
          there&apos;s no live site to preview here.
        </p>
      ) : (
        <p className="text-muted-foreground">
          Submit the intake form to see a live preview of your company&apos;s
          site here.
        </p>
      )}
    </div>
  );
}
