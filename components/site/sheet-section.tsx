import { cn } from "@/lib/utils";
import { Container } from "./container";

const variants = {
  a: "sheet-a",
  b: "sheet-b",
} as const;

/**
 * One "stacked sheet": a full-width section with rounded top corners that
 * overlaps the section above it. `tightBottom` trims the bottom padding for
 * the last sheet, which ends in the footer.
 */
export function SheetSection({
  variant = "a",
  tightBottom,
  className,
  containerClassName,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  variant?: keyof typeof variants;
  tightBottom?: boolean;
  containerClassName?: string;
}) {
  return (
    <section
      className={cn(
        "relative -mt-8 scroll-mt-16 rounded-t-[32px] pt-20 shadow-[0_-30px_60px_-24px_rgb(0_0_0/0.75),inset_0_1px_0_rgb(255_255_255/0.09)] md:-mt-12 md:rounded-t-[48px] md:pt-24 lg:pt-30",
        tightBottom ? "pb-12" : "pb-28 md:pb-36 lg:pb-42",
        variants[variant],
        className,
      )}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
