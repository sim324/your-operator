import { cn } from "@/lib/utils";

const sizes = {
  lg: "md:text-[21px] md:leading-8",
  md: "md:text-xl md:leading-[31px]",
} as const;

/** The larger paragraph that sits under a section heading. */
export function SectionLead({
  size = "lg",
  className,
  ...props
}: React.ComponentProps<"p"> & { size?: keyof typeof sizes }) {
  return (
    <p
      className={cn(
        "mt-[22px] text-lg leading-[1.6] text-ink-3",
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
