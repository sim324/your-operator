import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaButtonTryProps = Omit<
  React.ComponentProps<typeof Button>,
  "asChild" | "children"
>;

export default function CtaButtonTry({
  variant = "outline",
  size = "xl",
  className,
  ...props
}: CtaButtonTryProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(className)}
      asChild
      {...props}
    >
      <Link href="/demo">Try now</Link>
    </Button>
  );
}
