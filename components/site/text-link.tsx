import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartLink } from "./smart-link";

/** Quiet text link with an arrow that nudges right on hover. */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn(
    "group inline-flex items-center gap-2 font-medium whitespace-nowrap text-ink-2 transition-colors hover:text-white",
    className,
  );
  const content = (
    <>
      {children}
      <ArrowRight
        className="size-[15px] transition-transform group-hover:translate-x-[3px]"
        strokeWidth={2.2}
        aria-hidden="true"
      />
    </>
  );
  return (
    <SmartLink href={href} className={classes}>
      {content}
    </SmartLink>
  );
}
