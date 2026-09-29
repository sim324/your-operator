import { cn } from "@/lib/utils";

/** "▶ 0:06" length badge, pinned top-left of a video poster. */
export function PlayBadge({
  duration,
  className,
}: {
  duration: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute top-3.5 left-3.5 flex h-[30px] items-center gap-[7px] rounded-full bg-[rgb(10_14_26/0.72)] px-3 text-[13px] font-semibold text-ink-1",
        className,
      )}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M2 1 L9 5 L2 9 Z" fill="currentColor" />
      </svg>
      {duration}
    </span>
  );
}
