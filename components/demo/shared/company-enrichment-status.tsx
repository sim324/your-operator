"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { LeadCompanyRow, LeadCompanyStatus } from "@/lib/supabase/models";

const STEPS: { status: LeadCompanyStatus; label: string }[] = [
  { status: "scraping", label: "Scraping your site" },
  { status: "structuring", label: "Analyzing what you do" },
  { status: "uploading", label: "Finding your logo" },
];

const STATUS_ORDER: LeadCompanyStatus[] = [
  "pending",
  "scraping",
  "structuring",
  "uploading",
  "enriched",
  "failed",
];

interface CompanyEnrichment {
  business_type?: string;
  products_services?: string[];
  sells_to?: string;
  about?: string;
}

interface CompanyEnrichmentStatusProps {
  companyId: string;
  onUseSampleDataInstead: () => void;
}

export default function CompanyEnrichmentStatus({
  companyId,
  onUseSampleDataInstead,
}: CompanyEnrichmentStatusProps) {
  const [company, setCompany] = useState<LeadCompanyRow | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;

    supabase
      .from("lead_companies")
      .select("*")
      .eq("id", companyId)
      .single()
      .then(({ data }) => {
        if (!cancelled && data) setCompany(data);
      });

    const channel = supabase
      .channel(`lead-company-${companyId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "lead_companies",
          filter: `id=eq.${companyId}`,
        },
        (payload) => {
          setCompany(payload.new as LeadCompanyRow);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [companyId]);

  const status = company?.status as LeadCompanyStatus | undefined;
  const currentIndex = STATUS_ORDER.indexOf(status ?? "pending");

  if (status === "failed") {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-destructive/40 p-4 text-sm">
        <p className="text-destructive">
          We couldn&apos;t pull anything from that site.
        </p>
        <button
          type="button"
          onClick={onUseSampleDataInstead}
          className="self-start text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Use sample data instead
        </button>
      </div>
    );
  }

  if (status === "enriched" && company) {
    const enrichment = company.enrichment as CompanyEnrichment;

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {company.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element -- external, unoptimized company logo
            <img
              src={company.logo_url}
              alt=""
              className="size-12 rounded-lg border border-border bg-white object-contain p-1"
            />
          )}
          {company.brand_color && (
            <span
              className="size-6 shrink-0 rounded-full border border-border"
              style={{ backgroundColor: company.brand_color }}
              title={company.brand_color}
            />
          )}
          <span className="font-medium">
            {company.name ?? company.domain}
          </span>
        </div>

        {enrichment.about && (
          <p className="text-sm text-muted-foreground">{enrichment.about}</p>
        )}

        {(enrichment.business_type || enrichment.products_services) && (
          <div className="flex flex-wrap gap-2">
            {enrichment.business_type && (
              <Badge variant="secondary">{enrichment.business_type}</Badge>
            )}
            {enrichment.products_services?.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        )}

        {enrichment.sells_to && (
          <p className="text-sm text-muted-foreground">
            Sells to: {enrichment.sells_to}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {STEPS.map((step) => {
        const stepIndex = STATUS_ORDER.indexOf(step.status);
        const done = currentIndex > stepIndex;
        const active = status === step.status;

        return (
          <div key={step.status} className="flex items-center gap-3 text-sm">
            {done ? (
              <CheckIcon className="size-4 text-primary" />
            ) : active ? (
              <Spinner className="size-4" />
            ) : (
              <span className="size-4 rounded-full border border-border" />
            )}
            <span className={done || active ? "" : "text-muted-foreground"}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
