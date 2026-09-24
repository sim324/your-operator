"use server";

import { start } from "workflow/api";

import { getCurrentLeadCompany } from "@/lib/intake/current-company";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AiVisibilityStatus,
  LeadCompanyStatus,
} from "@/lib/supabase/models";
import { checkAiVisibilityWorkflow } from "@/workflows/check-ai-visibility";
import { ATTEMPTS_PER_QUERY } from "@/workflows/check-ai-visibility/constants";

export interface AiVisibilityActionResult {
  ok: boolean;
  error?: string;
}

// The "Check AI visibility" button. The company comes from the demo cookie,
// never from the client, so a direct POST can only run the caller's own.
export async function checkAiVisibility(): Promise<AiVisibilityActionResult> {
  const company = await getCurrentLeadCompany();
  if (!company) {
    return { ok: false, error: "Submit the intake form first." };
  }
  const enriched: LeadCompanyStatus = "enriched";
  if (!company.domain || company.status !== enriched) {
    return {
      ok: false,
      error: "We need your website analyzed before we can check this.",
    };
  }

  // Atomic claim, like the reviews buttons: a run is ~15 web-search answers,
  // so a double click must not start two.
  const generating: AiVisibilityStatus = "generating";
  const failed: AiVisibilityStatus = "failed";
  const supabase = getSupabaseServerClient();
  const { data: claimed, error } = await supabase
    .from("lead_companies")
    .update({ ai_visibility_status: generating })
    .eq("id", company.id)
    .or("ai_visibility_status.is.null,ai_visibility_status.eq.failed")
    .select("id");

  if (error) {
    return { ok: false, error: "Could not start the check." };
  }
  if (!claimed?.length) {
    return { ok: true };
  }

  try {
    await start(checkAiVisibilityWorkflow, [company.id]);
  } catch {
    await supabase
      .from("lead_companies")
      .update({ ai_visibility_status: failed })
      .eq("id", company.id);
    return { ok: false, error: "Could not start the check." };
  }

  return { ok: true };
}

export interface AiVisibilityProgress {
  // Answers finished so far (parsed, or failed and recorded)
  done: number;
  // Queries written × runs per query; 0 until the queries exist
  total: number;
}

// Polled by the page while a check runs. The answers table is server-only
// (no Realtime access), so progress is counted here rather than pushed.
export async function getAiVisibilityProgress(): Promise<AiVisibilityProgress | null> {
  const company = await getCurrentLeadCompany();
  if (!company) return null;

  const supabase = getSupabaseServerClient();
  const [{ count: queries }, { count: done }] = await Promise.all([
    supabase
      .from("ai_visibility_queries")
      .select("id", { count: "exact", head: true })
      .eq("company_id", company.id),
    supabase
      .from("ai_visibility_answers")
      .select("id", { count: "exact", head: true })
      .eq("company_id", company.id)
      // Parsed, or recorded as failed: either way that answer is finished.
      .or("mentioned.not.is.null,error.not.is.null"),
  ]);

  return {
    done: done ?? 0,
    total: (queries ?? 0) * ATTEMPTS_PER_QUERY,
  };
}
