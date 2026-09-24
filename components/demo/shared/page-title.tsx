import { cn } from "@/lib/utils";

export default function PageTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return <h1 className={cn("text-4xl font-black", className)} {...props} />;
}
