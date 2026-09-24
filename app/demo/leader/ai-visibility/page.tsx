import AiVisibilityResultsView from "@/components/demo/leader/ai-visibility/ai-visibility-results";
import AiVisibilityRunner from "@/components/demo/leader/ai-visibility/ai-visibility-runner";
import PageTitle from "@/components/demo/shared/page-title";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { getAiVisibilityResults } from "@/lib/ai-visibility/results";
import { getCurrentLeadCompany } from "@/lib/intake/current-company";
import type {
  AiVisibilityLocation,
  AiVisibilityStatus,
  LeadCompanyRow,
  LeadCompanyStatus,
} from "@/lib/supabase/models";

const STATUS_ENRICHED: LeadCompanyStatus = "enriched";

async function AiVisibilitySection({ company }: { company: LeadCompanyRow }) {
  const companyName = company.name ?? company.domain ?? "your business";

  // Queries are written from the scraped site, so enrichment has to have
  // run on a real website. Sample and no-website companies have neither.
  if (!company.domain || company.status !== STATUS_ENRICHED) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>Needs a website</EmptyTitle>
          <EmptyDescription>
            AI visibility is checked against searches written from your
            website, so it needs a company that came through intake with a
            website we could analyze.
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
        companyName={companyName}
        initialStatus={status}
      />
    );
  }

  const results = await getAiVisibilityResults(company.id, company.domain);
  return (
    <AiVisibilityResultsView
      results={results}
      companyName={companyName}
      location={company.ai_visibility_location as AiVisibilityLocation | null}
      checkedAt={company.ai_visibility_updated_at}
    />
  );
}

export default async function DemoLeaderAiVisibilityPage() {
  const company = await getCurrentLeadCompany();

  return (
    <div className="space-y-6">
      <PageTitle>AI Visibility</PageTitle>
      {company ? (
        <AiVisibilitySection company={company} />
      ) : (
        <p className="text-muted-foreground">
          Submit the intake form to check how AI recommends your company.
        </p>
      )}
    </div>
  );
}
