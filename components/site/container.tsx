import { cn } from "@/lib/utils";

/** Content column: 1232px wide at the 1440 design width, fluid below. */
export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1312px] px-5 sm:px-8 lg:px-10", className)}
      {...props}
    />
  );
}
