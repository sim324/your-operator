import AppShell from "@/components/demo/shared/app-shell";
import EmailGateDialog from "@/components/demo/shared/email-gate-dialog";
import RoleSwitcherBanner from "@/components/demo/shared/role-switcher-banner";
import { getCurrentLeadCompany } from "@/lib/intake/current-company";

export default async function DemoLayout({ children }: LayoutProps<"/demo">) {
  const company = await getCurrentLeadCompany();

  // A company only has real "results" to show if something enriches it
  // (a domain kicks off the workflow, sample data is instant) or it already
  // finished/failed. The no-website/manual path never gets a pipeline and
  // sits at "pending" forever, so it falls back to the plain thank-you view
  // instead of CompanyEnrichmentStatus's step list, which would spin
  // forever waiting on stages that never start.
  const hasPipeline =
    company !== null &&
    (company.domain !== null ||
      company.status === "enriched" ||
      company.status === "failed");

  return (
    <div className="flex h-svh flex-col">
      <EmailGateDialog
        initialCompanyId={hasPipeline && company ? company.id : null}
        initialValidated={company !== null && !hasPipeline}
      />
      <RoleSwitcherBanner
        companyName={company?.name ?? company?.domain ?? null}
      />
      <AppShell>{children}</AppShell>
    </div>
  );
}
