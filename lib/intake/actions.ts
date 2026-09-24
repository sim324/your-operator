"use server";

import { cookies } from "next/headers";
import { start } from "workflow/api";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  LeadCompanyRow,
  LeadCompanySource,
  LeadCompanyStatus,
} from "@/lib/supabase/models";
import { LEAD_COMPANY_COOKIE } from "@/lib/intake/constants";
import { normalizeDomain } from "@/lib/intake/domain";
import { enrichCompanyWorkflow } from "@/workflows/enrich-company";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SubmitIntakeInput {
  email: string;
  domain?: string;
  companyName?: string;
  companyDescription?: string;
  useSampleData?: boolean;
}

export interface SubmitIntakeResult {
  ok: boolean;
  error?: string;
  companyId?: string;
  // True when enrichment was just kicked off async and the caller should
  // watch the company row (e.g. via Realtime) for progress, rather than
  // treating it as already finished.
  isEnriching?: boolean;
}

const SAMPLE_COMPANY = {
  name: "Acme Robotics",
  logo_url: "https://placehold.co/128x128/6d28d9/ffffff?text=Acme",
  brand_color: "#6d28d9",
  enrichment: {
    business_type: "B2B SaaS",
    products_services: [
      "Warehouse automation robots",
      "Fleet management software",
    ],
    sells_to: "Mid-market logistics and 3PL operators",
    about:
      "Sample data — Acme Robotics builds autonomous forklifts and the software to run them.",
  },
} satisfies Pick<
  LeadCompanyRow,
  "name" | "logo_url" | "brand_color" | "enrichment"
>;

// Typed against the source/status unions (the generated column types are
// plain `string`, since Postgres CHECK constraints aren't reflected there) so
// a typo here is still a compile error.
const SOURCE_SAMPLE: LeadCompanySource = "sample";
const SOURCE_MANUAL: LeadCompanySource = "manual";
const STATUS_ENRICHED: LeadCompanyStatus = "enriched";
const STATUS_PENDING: LeadCompanyStatus = "pending";

interface ResolvedCompany {
  companyId: string;
  // Set only when a brand-new row was just created for a real domain, so the
  // caller can kick off enrichment. Reused rows and the no-website/sample
  // paths leave this null (already enriched, or nothing to scrape).
  enrichDomain: string | null;
}

async function resolveCompanyId(
  input: SubmitIntakeInput,
): Promise<ResolvedCompany | { error: string }> {
  const supabase = getSupabaseServerClient();

  if (input.useSampleData) {
    const { data, error } = await supabase
      .from("lead_companies")
      .insert({
        domain: null,
        name: SAMPLE_COMPANY.name,
        logo_url: SAMPLE_COMPANY.logo_url,
        brand_color: SAMPLE_COMPANY.brand_color,
        enrichment: SAMPLE_COMPANY.enrichment,
        source: SOURCE_SAMPLE,
        status: STATUS_ENRICHED,
      })
      .select("id")
      .single();

    if (error || !data) return { error: "Could not create sample company." };
    return { companyId: data.id, enrichDomain: null };
  }

  const domain = input.domain ? normalizeDomain(input.domain) : null;
  const name = input.companyName?.trim() || null;
  const description = input.companyDescription?.trim() || null;

  if (!domain && !name) {
    return { error: "Enter a company domain, or a name and description." };
  }

  if (domain) {
    const { data: existing } = await supabase
      .from("lead_companies")
      .select("id")
      .eq("domain", domain)
      .maybeSingle();

    if (existing) return { companyId: existing.id, enrichDomain: null };
  }

  const { data, error } = await supabase
    .from("lead_companies")
    .insert({
      domain,
      name,
      description,
      status: STATUS_PENDING,
      source: SOURCE_MANUAL,
    })
    .select("id")
    .single();

  if (error || !data) return { error: "Could not save company." };
  return { companyId: data.id, enrichDomain: domain };
}

async function upsertContact(email: string, companyId: string) {
  const supabase = getSupabaseServerClient();

  const { data: existing } = await supabase
    .from("lead_contacts")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("lead_contacts")
      .update({ company_id: companyId })
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error || !data) return { error: "Could not update your record." };
    return { contactId: data.id };
  }

  const { data, error } = await supabase
    .from("lead_contacts")
    .insert({ email, company_id: companyId })
    .select("id")
    .single();

  if (error || !data) return { error: "Could not save your email." };
  return { contactId: data.id };
}

export async function submitIntake(
  input: SubmitIntakeInput,
): Promise<SubmitIntakeResult> {
  const email = input.email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, error: "Enter a valid email to continue." };
  }

  const companyResult = await resolveCompanyId(input);
  if ("error" in companyResult) {
    return { ok: false, error: companyResult.error };
  }

  const contactResult = await upsertContact(email, companyResult.companyId);
  if ("error" in contactResult) {
    return { ok: false, error: contactResult.error };
  }

  const isEnriching = Boolean(companyResult.enrichDomain);
  if (companyResult.enrichDomain) {
    await start(enrichCompanyWorkflow, [
      companyResult.companyId,
      companyResult.enrichDomain,
    ]);
  }

  const cookieStore = await cookies();
  cookieStore.set(LEAD_COMPANY_COOKIE, companyResult.companyId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
  });

  return { ok: true, companyId: companyResult.companyId, isEnriching };
}

export async function clearLeadCompanyCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(LEAD_COMPANY_COOKIE);
}
