"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type CtaButtonBookProps = Omit<
  React.ComponentProps<typeof Button>,
  "data-cal-namespace" | "data-cal-link" | "data-cal-config"
>;

export default function CtaButtonBook({
  variant = "default",
  size = "xl",
  ...props
}: CtaButtonBookProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "connect" });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#141414" },
          dark: { "cal-brand": "#fafafa" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Button
      variant={variant}
      size={size}
      data-cal-namespace="connect"
      data-cal-link="your-operator-sim/connect"
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"auto"}'
      {...props}
    >
      Book a call
    </Button>
  );
}
