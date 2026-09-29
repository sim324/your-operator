import { cn } from "@/lib/utils";

export function LogoMark({
  width = 26,
  className,
}: {
  width?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={Math.round(width * (124 / 112))}
      viewBox="0 0 112 124"
      aria-hidden="true"
      className={cn(
        "block shrink-0 overflow-visible drop-shadow-[0_0_6px_rgb(96_165_250/0.5)]",
        className,
      )}
    >
      <path
        d="M56 4 L106 33 L106 91 L56 120 L6 91 L6 33 Z"
        fill="none"
        stroke="#60A5FA"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M56 17 L95 39.5 L95 84.5 L56 107 L17 84.5 L17 39.5 Z"
        fill="none"
        stroke="#60A5FA"
        strokeOpacity="0.35"
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <g stroke="#FAFAFA" strokeWidth="6.5" strokeLinecap="round">
        <line x1="36" x2="36" y1="53" y2="71" />
        <line x1="46" x2="46" y1="45" y2="79" />
        <line x1="56" x2="56" y1="37" y2="87" />
        <line x1="66" x2="66" y1="45" y2="79" />
        <line x1="76" x2="76" y1="53" y2="71" />
      </g>
    </svg>
  );
}
