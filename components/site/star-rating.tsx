import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Five filled gold stars. */
export function StarRating({
  size = 16,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("flex gap-[3px]", className)}
      role="img"
      aria-label="Five stars"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className="fill-star stroke-star"
          strokeWidth={1.5}
          strokeLinejoin="round"
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
