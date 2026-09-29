"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GlassPanel } from "./glass-panel";
import { Glow } from "./glow";

const OPEN_EVENT = "film:open";
const layer =
  "absolute inset-0 size-full transition-opacity duration-[350ms] ease-out";

/**
 * Framed video that plays a silent loop until someone asks for the whole film,
 * which then plays with sound in the same frame and hands back to the loop
 * when it ends or is closed. Only one film plays at a time on a page.
 */
export function FilmPlayer({
  loopSrc,
  loopPoster,
  loopLabel,
  filmSrc,
  filmPoster,
  filmLabel,
  aspect,
  openText,
  openAria,
  closeText = "Close film",
  caption,
  glowClassName,
  className,
}: {
  loopSrc: string;
  loopPoster: string;
  loopLabel: string;
  filmSrc: string;
  filmPoster: string;
  filmLabel: string;
  /** Tailwind aspect utility for the screen, e.g. "aspect-[1212/757]". */
  aspect: string;
  openText: string;
  openAria: string;
  closeText?: string;
  /** Optional line shown beside the button, e.g. "From the demo: …". */
  caption?: string;
  glowClassName?: string;
  className?: string;
}) {
  const id = useId();
  const loopRef = useRef<HTMLVideoElement>(null);
  const filmRef = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  const show = useCallback(() => {
    const film = filmRef.current;
    if (!film) return;
    film.muted = false;
    film.currentTime = 0;
    film.play().catch(() => {});
    setOpen(true);
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
  }, [id]);

  const hide = useCallback(() => {
    filmRef.current?.pause();
    setOpen(false);
  }, []);

  // Close when a different film on the page is opened.
  useEffect(() => {
    if (!open) return;
    const onOtherOpen = (e: Event) => {
      if ((e as CustomEvent).detail !== id) hide();
    };
    window.addEventListener(OPEN_EVENT, onOtherOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOtherOpen);
  }, [open, id, hide]);

  // The silent loop only plays while it is on screen and the film is closed.
  useEffect(() => {
    const loop = loopRef.current;
    if (!loop) return;
    if (open) {
      loop.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loop.play().catch(() => {});
        else loop.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(loop);
    return () => observer.disconnect();
  }, [open]);

  const toggle = (
    <Button
      type="button"
      variant={open ? "glass" : "light"}
      size="pill"
      onClick={open ? hide : show}
      aria-label={open ? "Close the film" : openAria}
    >
      {open ? (
        <X className="size-3" strokeWidth={3} aria-hidden="true" />
      ) : (
        <Play className="size-3 fill-current" aria-hidden="true" />
      )}
      {open ? closeText : openText}
      {!open && <span className="font-medium text-[#5b6478]">2 min</span>}
    </Button>
  );

  return (
    <figure className={cn("m-0", className)}>
      <div className="relative">
        <Glow
          alpha={0.34}
          className={cn(
            "-top-16 left-1/2 h-[60%] w-[88%] -translate-x-1/2",
            glowClassName,
          )}
        />
        <GlassPanel
          variant="frame"
          className="relative rounded-[20px] p-1.5 sm:p-2.5 md:rounded-[30px]"
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-[14px] bg-surface sm:rounded-[21px]",
              aspect,
            )}
          >
            <video
              ref={loopRef}
              src={loopSrc}
              poster={loopPoster}
              muted
              loop
              playsInline
              aria-label={loopLabel}
              onClick={show}
              className={cn(
                layer,
                "object-cover",
                open ? "pointer-events-none opacity-0" : "cursor-pointer",
              )}
            />
            <video
              ref={filmRef}
              src={filmSrc}
              poster={filmPoster}
              preload="none"
              controls
              playsInline
              aria-label={filmLabel}
              onEnded={hide}
              className={cn(
                layer,
                "bg-surface-deep object-contain",
                open ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            />
          </div>
        </GlassPanel>
      </div>

      {caption ? (
        <figcaption className="mt-[18px] flex flex-col items-center justify-center gap-3 text-center text-sm text-ink-5 sm:flex-row sm:gap-[22px] md:text-[14.5px]">
          <span>{caption}</span>
          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-white/16 sm:block"
          />
          {toggle}
        </figcaption>
      ) : (
        <div className="mt-[22px] flex justify-center">{toggle}</div>
      )}
    </figure>
  );
}
