import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/** The "01 │ THE PROBLEM" label that opens every section. */
export function SectionEyebrow({
  number,
  children,
  className,
}: {
  number?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "mb-5 h-[30px] gap-2.5 rounded-full border-0 bg-white/[0.035] px-3.5 text-[11.5px] font-semibold tracking-[0.14em] text-ink-3 ring-1 ring-white/10 ring-inset",
        className,
      )}
    >
      {number && (
        <>
          <span className="text-azure-400">{number}</span>
          <Separator orientation="vertical" className="h-3 bg-white/20" />
        </>
      )}
      {children}
    </Badge>
  );
}
