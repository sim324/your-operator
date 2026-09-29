import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";
import type { ComponentProps } from "react";

type Props = {
  size?: ComponentProps<typeof Button>["size"];
  arrow?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/** The primary blue call-to-action: opens the Cal.com booking popup. */
export function BookCallButton({
  size = "cta-lg",
  arrow = true,
  className,
  children = SITE.bookLabel,
}: Props) {
  return (
    <Button
      type="button"
      variant="brand"
      size={size}
      className={className}
      data-cal-namespace={SITE.cal.namespace}
      data-cal-link={SITE.cal.link}
      data-cal-config={SITE.cal.config}
    >
      {children}
      {arrow && <ArrowRight className="size-[18px]" strokeWidth={2.4} />}
    </Button>
  );
}
