import { cn } from "@/lib/utils";
import { Portrait } from "./portrait";
import type { ComponentProps } from "react";

/** A short pull quote with a small round photo and who said it. */
export function Quote({
  portrait,
  children,
  caption,
  size = "md",
  className,
}: {
  portrait: ComponentProps<typeof Portrait>;
  children: React.ReactNode;
  caption: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <figure className={cn("flex items-center gap-4", className)}>
      <Portrait {...portrait} />
      <div>
        <blockquote
          className={cn(
            "font-medium text-ink-1",
            size === "lg" &&
              "text-xl leading-[1.35] tracking-[-0.01em] md:text-[22px] md:leading-[30px]",
            size === "md" && "text-lg leading-[26px]",
            size === "sm" && "text-[15px] leading-5",
          )}
        >
          {children}
        </blockquote>
        <figcaption
          className={cn(
            "mt-1 text-ink-5",
            size === "sm" ? "text-[13.5px] text-ink-6" : "text-sm",
          )}
        >
          {caption}
        </figcaption>
      </div>
    </figure>
  );
}
