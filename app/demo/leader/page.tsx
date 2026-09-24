import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import PageTitle from "@/components/demo/shared/page-title";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAiVisibilityResults } from "@/lib/ai-visibility/results";
import { getCurrentLeadCompany } from "@/lib/intake/current-company";
import { getReviewHistory } from "@/lib/reviews/history";
import type {
  AiVisibilityStatus,
  GoogleReviewsStatus,
  LeadCompanyRow,
} from "@/lib/supabase/models";

interface Headline {
  value: string;
  label: string;
}

// One card per leader page: its headline number once that data exists,
// otherwise a prompt to go run it. Both numbers come from our own tables, so
// the dashboard costs no Google or Claude calls.
function SectionCard({
  href,
  title,
  description,
  headline,
  emptyText,
}: {
  href: string;
  title: string;
  description: string;
  headline: Headline | null;
  emptyText: string;
}) {
  return (
    <Link href={href} className="group rounded-4xl outline-none">
      <Card className="h-full transition-colors group-hover:bg-muted/50 group-focus-visible:ring-2">
        <CardHeader>
          <CardTitle className="text-2xl font-black">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <ArrowRightIcon className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </CardAction>
        </CardHeader>
        <CardContent className="mt-auto">
          {headline ? (
            <div className="flex flex-col gap-2">
              <p className="text-7xl leading-none font-black tabular-nums">
                {headline.value}
              </p>
              <p className="text-sm text-muted-foreground">{headline.label}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{emptyText}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

async function reviewsHeadline(
  company: LeadCompanyRow,
): Promise<Headline | null> {
  const status = company.google_reviews_status as GoogleReviewsStatus | null;
  if (status !== "ready") return null;

  const history = await getReviewHistory(company.id);
  if (history.averageRating === null) return null;
  return {
    value: history.averageRating.toFixed(1),
    label: `Average rating across ${history.total.toLocaleString()} reviews`,
  };
}

async function aiVisibilityHeadline(
  company: LeadCompanyRow,
): Promise<Headline | null> {
  const status = company.ai_visibility_status as AiVisibilityStatus | null;
  if (status !== "ready") return null;

  const results = await getAiVisibilityResults(company.id, company.domain);
  if (!results.totalRuns) return null;
  return {
    value: `${Math.round((results.mentionedRuns / results.totalRuns) * 100)}%`,
    label: `Recommended by AI in ${results.mentionedRuns} of ${results.totalRuns} answers`,
  };
}

export default async function DemoLeaderPage() {
  const company = await getCurrentLeadCompany();
  const [reviews, aiVisibility] = company
    ? await Promise.all([
        reviewsHeadline(company),
        aiVisibilityHeadline(company),
      ])
    : [null, null];

  return (
    <div className="flex flex-col gap-6">
      <PageTitle>Dashboard</PageTitle>
      <div className="grid gap-6 md:grid-cols-2 lg:p-1 lg:pb-2">
        <SectionCard
          href="/demo/leader/reviews"
          title="Reviews"
          description="Your Google reviews, trends and themes"
          headline={reviews}
          emptyText="Pull your Google reviews to see your rating and trends"
        />
        <SectionCard
          href="/demo/leader/ai-visibility"
          title="AI visibility"
          description="Whether AI recommends you when customers search"
          headline={aiVisibility}
          emptyText="Run a blind test to see if AI recommends you"
        />
      </div>
    </div>
  );
}
