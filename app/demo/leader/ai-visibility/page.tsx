import AiVisibilityResultsView from "@/components/demo/leader/ai-visibility/ai-visibility-results";
import AiVisibilityRunner from "@/components/demo/leader/ai-visibility/ai-visibility-runner";
import PageTitle from "@/components/demo/shared/page-title";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  getAiVisibilityResults,
  isRunStale,
} from "@/lib/ai-visibility/results";
import { getCurrentLeadCompany } from "@/lib/intake/current-company";
import type {
  AiVisibilityStatus,
  LeadCompanyRow,
  LeadCompanyStatus,
} from "@/lib/supabase/models";

const STATUS_ENRICHED: LeadCompanyStatus = "enriched";

async function AiVisibilitySection({ company }: { company: LeadCompanyRow }) {
  // Queries are written from the scraped site, so enrichment has to have
  // run on a real website. Sample and no-website companies have neither.
  if (!company.domain || company.status !== STATUS_ENRICHED) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Needs a website</EmptyTitle>
          <EmptyDescription>
            AI visibility is checked against searches written from your website,
            so it needs a company that came through intake with a website we
            could analyze.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const status = company.ai_visibility_status as AiVisibilityStatus | null;
  if (status !== "ready") {
    return (
      <AiVisibilityRunner
        companyId={company.id}
        initialStatus={status}
        isStale={isRunStale(status, company.ai_visibility_updated_at)}
      />
    );
  }

  const results = await getAiVisibilityResults(company.id, company.domain);
  return <AiVisibilityResultsView results={results} />;
}

export default async function DemoLeaderAiVisibilityPage() {
  const company = await getCurrentLeadCompany();

  // A flex column filling the shell, like the prospect page, so the
  // runner's empty state stretches to the bottom of the page.
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageTitle>AI Visibility</PageTitle>
      {company ? (
        // Same inset as the reviews columns, so cards line up across pages;
        // a flex column so the runner's empty state still fills the height.
        <div className="flex min-h-0 flex-1 flex-col lg:p-1 lg:pb-2">
          <AiVisibilitySection company={company} />
        </div>
      ) : (
        <p className="text-muted-foreground">
          Submit the intake form to check how AI recommends your company.
        </p>
      )}
    </div>
  );
}
