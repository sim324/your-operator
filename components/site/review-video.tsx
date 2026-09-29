import { PlayBadge } from "./play-badge";

/** Portrait phone-style client video with a short caption. */
export function ReviewVideo({
  video,
  poster,
  label,
  duration,
  who,
  quote,
}: {
  video: string;
  poster: string;
  label: string;
  duration: string;
  who: string;
  quote: string;
}) {
  return (
    <figure className="w-full max-w-[340px]">
      <div className="relative overflow-hidden rounded-3xl bg-surface-deep shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_40px_80px_-30px_rgb(0_0_0/0.9)]">
        <video
          src={video}
          poster={poster}
          controls
          preload="metadata"
          playsInline
          aria-label={label}
          className="block aspect-[340/472] w-full object-cover"
        />
        <PlayBadge duration={duration} />
      </div>
      <figcaption className="mt-4 flex flex-col gap-1">
        <span className="text-[15.5px] font-semibold">{who}</span>
        <span className="text-[15px] text-ink-4">{quote}</span>
      </figcaption>
    </figure>
  );
}
