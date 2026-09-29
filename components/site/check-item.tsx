import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Small sky-blue tick followed by text. */
export function CheckItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("inline-flex items-center gap-[7px]", className)}>
      <Check
        className="size-3 shrink-0 text-azure-300"
        strokeWidth={3}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}
