import { cn } from "@/lib/utils";

/**
 * Tile for a hand-built illustration. Scenes are drawn in fixed pixels at the
 * design size and centred in the tile; `shrink` zooms them down on phones.
 */
export function Stage({
  label,
  sceneWidth,
  shrink = "min-[401px]:max-sm:[zoom:0.85] max-[400px]:[zoom:0.75]",
  children,
}: {
  label: string;
  sceneWidth: number;
  shrink?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className="bg-stage relative flex h-[400px] items-center justify-center rounded-[28px] shadow-[inset_0_1px_0_rgb(255_255_255/0.09),inset_0_0_0_1px_rgb(255_255_255/0.06)]"
    >
      <div
        className={cn("relative h-[400px] shrink-0", shrink)}
        style={{ width: sceneWidth }}
      >
        {children}
      </div>
    </div>
  );
}

/** Soft floor shadow under an illustrated object. */
export function FloorShadow({
  width,
  bottom,
}: {
  width: number;
  bottom: number;
}) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 h-7 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_0_0/0.6),rgb(0_0_0/0))]"
      style={{ width, bottom }}
    />
  );
}
