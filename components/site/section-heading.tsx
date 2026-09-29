import { cn } from "@/lib/utils";

const sizes = {
  xl: "text-[44px] leading-[1.05] tracking-[-0.045em] md:text-6xl lg:text-[72px] lg:leading-[76px]",
  lg: "text-4xl leading-[1.1] tracking-[-0.04em] md:text-5xl lg:text-[64px] lg:leading-[70px]",
  mid: "text-3xl leading-[1.15] tracking-[-0.035em] md:text-4xl lg:text-[56px] lg:leading-[62px]",
  md: "text-3xl leading-[1.15] tracking-[-0.035em] md:text-4xl lg:text-5xl lg:leading-[54px]",
} as const;

/**
 * Large Bricolage heading. `dim` is the muted second line, which drops to its
 * own line on every breakpoint the way the mockups break it.
 */
export function SectionHeading({
  children,
  dim,
  size = "lg",
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode;
  dim?: React.ReactNode;
  size?: keyof typeof sizes;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "font-display font-bold text-ink text-balance",
        sizes[size],
        className,
      )}
    >
      {children}
      {dim && <span className="block text-ink-dim">{dim}</span>}
    </Tag>
  );
}
