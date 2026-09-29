import { cn } from "@/lib/utils";

/** "MONTH 3 · date ──────" divider with a one-paragraph summary beneath. */
export function Milestone({
  label,
  date,
  lead,
  children,
  className,
}: {
  label: string;
  date: string;
  lead: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3.5">
        <span className="flex h-7 items-center rounded-full bg-brand/16 px-3 text-xs font-semibold tracking-[0.14em] whitespace-nowrap text-azure-200 ring-1 ring-azure-300/30 ring-inset">
          {label}
        </span>
        <span className={cn("text-[15px] text-ink-4 md:whitespace-nowrap")}>
          {date}
        </span>
        <span
          aria-hidden="true"
          className="hidden h-px grow bg-white/10 sm:block"
        />
      </div>
      <p className="mt-3.5 max-w-[1000px] text-[15.5px] leading-6 text-ink-3">
        <span className="font-semibold text-azure-300">{lead}</span> {children}
      </p>
    </div>
  );
}
