"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { SITE } from "@/lib/site";

/**
 * Loads the Cal.com embed once for the whole site. Any element with the
 * `data-cal-*` attributes (see BookCallButton) then opens the booking popup.
 */
export function CalEmbed() {
  useEffect(() => {
    // Cal's iframe paints an opaque light backdrop unless its colour scheme
    // matches the page it sits in, so match it while a marketing page is up.
    const root = document.documentElement;
    const previous = root.style.colorScheme;
    root.style.colorScheme = "dark";
    (async () => {
      const cal = await getCalApi({ namespace: SITE.cal.namespace });
      cal("ui", { ...SITE.cal.ui, colorScheme: "dark" });
    })();
    return () => {
      root.style.colorScheme = previous;
    };
  }, []);

  return null;
}
