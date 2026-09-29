import Image, { type StaticImageData } from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * Circular photo with a white ring. `zoom`, `x`, `y` re-crop the source photo
 * the way the mockups do (scale from an origin, shift the focal point).
 */
export function Portrait({
  src,
  alt = "",
  size,
  zoom = 1,
  focus = "50% 50%",
  origin = "50% 50%",
  ring = "sm",
  className,
  sizes,
  priority,
}: {
  src: string | StaticImageData;
  alt?: string;
  /** Pixel size at the 1440 design width. */
  size: number;
  zoom?: number;
  focus?: string;
  origin?: string;
  ring?: "sm" | "lg";
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Avatar
      className={cn(
        "aspect-square h-auto max-w-full shrink-0 overflow-hidden after:hidden",
        ring === "sm"
          ? "shadow-[0_0_0_2px_rgb(247_248_251/0.85),0_8px_18px_-8px_rgb(0_0_0/0.7)]"
          : "shadow-[0_0_0_5px_rgb(255_255_255/0.92),0_34px_60px_-18px_rgb(0_0_0/0.85)]",
        className,
      )}
      style={{ width: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size * 2}
        height={size * 2}
        sizes={sizes ?? `${size}px`}
        priority={priority}
        className="size-full object-cover"
        style={{
          objectPosition: focus,
          transform: zoom === 1 ? undefined : `scale(${zoom})`,
          transformOrigin: origin,
        }}
      />
    </Avatar>
  );
}
