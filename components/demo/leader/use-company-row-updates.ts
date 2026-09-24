"use client";

import { useEffect, useRef } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { LeadCompanyRow } from "@/lib/supabase/models";

// Subscribes to Realtime UPDATEs on one lead_companies row (readable via the
// "Public read access to lead companies" policy). Workflows report progress
// by writing status columns there, so this is how the leader page's status
// components hear back.
export function useCompanyRowUpdates(
  companyId: string,
  onUpdate: (row: LeadCompanyRow) => void,
) {
  // Keep the latest callback without resubscribing on every render.
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  });

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel(
        `lead-company-row-${companyId}-${Math.random().toString(36).slice(2)}`,
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "lead_companies",
          filter: `id=eq.${companyId}`,
        },
        (payload) => onUpdateRef.current(payload.new as LeadCompanyRow),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [companyId]);
}
