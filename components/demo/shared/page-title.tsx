import { cn } from "@/lib/utils";

export default function PageTitle({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return <h1 className={cn("text-2xl font-black", className)} {...props} />;
}
