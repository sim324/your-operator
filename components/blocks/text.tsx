import { cn } from "@/lib/utils";

export default function Heading1({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-5xl sm:text-7xl lg:text-9xl font-black tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function Subheading({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-2xl/10 font-medium", className)} {...props} />;
}
