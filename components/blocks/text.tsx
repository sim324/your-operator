import { cn } from "@/lib/utils";

export default function Heading1({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-7xl leading-none font-black tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function Subheading({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-3xl/10 text-balance xl:text-4xl", className)}
      {...props}
    />
  );
}
