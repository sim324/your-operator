import { cn } from "@/lib/utils";

/** Glossy dark container: `panel` for bars and cards, `frame` for hero media. */
export function GlassPanel({
  variant = "panel",
  className,
  ...props
}: React.ComponentProps<"div"> & { variant?: "panel" | "frame" }) {
  return (
    <div
      className={cn(
        "bg-linear-to-b from-[rgb(24_28_40/0.92)] to-[rgb(13_15_23/0.94)]",
        variant === "panel" ? "shadow-panel" : "shadow-frame",
        className,
      )}
      {...props}
    />
  );
}
