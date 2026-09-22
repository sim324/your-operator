import { cookies } from "next/headers";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadCompanyRow } from "@/lib/supabase/models";
import { LEAD_COMPANY_COOKIE } from "@/lib/intake/constants";

/**
 * Reads the "who is this demo session for" cookie set by submitIntake and
 * fetches the current lead_companies row. Safe to call from any server
 * component - the prospects page uses it for the iframe/URL, and it's the
 * intended source for app-shell branding (logo/brand color) later.
 *
 * Returns null when there's no cookie (no intake submitted yet) or the row
 * can't be found.
 */
export async function getCurrentLeadCompany(): Promise<LeadCompanyRow | null> {
  const cookieStore = await cookies();
  const companyId = cookieStore.get(LEAD_COMPANY_COOKIE)?.value;
  if (!companyId) return null;

  const supabase = getSupabaseServerClient();
  const { data } = await supabase
    .from("lead_companies")
    .select("*")
    .eq("id", companyId)
    .maybeSingle();

  return data ?? null;
}
