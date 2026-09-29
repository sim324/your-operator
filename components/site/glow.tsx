import { cn } from "@/lib/utils";

/** Soft radial light behind a piece of media. Position it with `className`. */
export function Glow({
  alpha = 0.3,
  rgb = "59 130 246",
  className,
}: {
  alpha?: number;
  /** Space-separated r g b, blue by default. */
  rgb?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full", className)}
      style={{
        backgroundImage: `radial-gradient(closest-side, rgb(${rgb} / ${alpha}), rgb(${rgb} / 0))`,
      }}
    />
  );
}
