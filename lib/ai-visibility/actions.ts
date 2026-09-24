"use server";

import { getRun, start } from "workflow/api";

import { getCurrentLeadCompany } from "@/lib/intake/current-company";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AiVisibilityStatus,
  LeadCompanyStatus,
} from "@/lib/supabase/models";
import { checkAiVisibilityWorkflow } from "@/workflows/check-ai-visibility";
import {
  ATTEMPTS_PER_QUERY,
  STALE_RUN_MS,
} from "@/workflows/check-ai-visibility/constants";

export interface AiVisibilityActionResult {
  ok: boolean;
  error?: string;
}

// The "Check AI visibility" and "Run again" buttons. The company comes from
// the demo cookie, never from the client, so a direct POST can only run the
// caller's own.
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
  // so a double click must not start two. Claimable when it never ran,
  // failed, finished ("Run again"), or is stuck: still in progress long
  // after its last status change, e.g. a cancelled run whose failure
  // handler never ran.
  const generating: AiVisibilityStatus = "generating";
  const failed: AiVisibilityStatus = "failed";
  const staleBefore = new Date(Date.now() - STALE_RUN_MS).toISOString();
  const supabase = getSupabaseServerClient();
  const { data: claimed, error } = await supabase
    .from("lead_companies")
    .update({
      ai_visibility_status: generating,
      ai_visibility_updated_at: new Date().toISOString(),
    })
    .eq("id", company.id)
    .or(
      `ai_visibility_status.is.null,ai_visibility_status.in.(failed,ready),ai_visibility_updated_at.lt.${staleBefore}`,
    )
    .select("id");

  if (error) {
    return { ok: false, error: "Could not start the check." };
  }
  if (!claimed?.length) {
    return { ok: true };
  }

  try {
    const run = await start(checkAiVisibilityWorkflow, [company.id]);
    // Kept so Cancel can stop this run.
    await supabase
      .from("lead_companies")
      .update({ ai_visibility_run_id: run.runId })
      .eq("id", company.id);
  } catch {
    await supabase
      .from("lead_companies")
      .update({ ai_visibility_status: failed })
      .eq("id", company.id);
    return { ok: false, error: "Could not start the check." };
  }

  return { ok: true };
}

// The "Cancel" button while a check runs (or looks stuck). Cancelling the
// run stops any step that hasn't started, but steps already running finish:
// answers mid-search still complete and are billed, and their rows are
// replaced by the next run. The page goes back to its never-run state.
export async function cancelAiVisibility(): Promise<AiVisibilityActionResult> {
  const company = await getCurrentLeadCompany();
  if (!company) {
    return { ok: false, error: "Submit the intake form first." };
  }

  const inProgress: AiVisibilityStatus[] = ["generating", "checking"];
  if (!inProgress.includes(company.ai_visibility_status as AiVisibilityStatus)) {
    return { ok: true };
  }
  if (company.ai_visibility_run_id) {
    try {
      await getRun(company.ai_visibility_run_id).cancel();
    } catch {
      // Already finished or gone; resetting the status below is all that's
      // left to do.
    }
  }

  // Only while still in progress: a run that finished in the meantime keeps
  // its results.
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("lead_companies")
    .update({
      ai_visibility_status: null,
      ai_visibility_run_id: null,
      ai_visibility_updated_at: new Date().toISOString(),
    })
    .eq("id", company.id)
    .in("ai_visibility_status", inProgress);
  if (error) {
    return { ok: false, error: "Could not cancel the check." };
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
