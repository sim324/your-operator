import { PlayBadge } from "./play-badge";

/** A customer video with a headline, their words and who said them. */
export function TestimonialCard({
  video,
  poster,
  label,
  duration,
  title,
  quote,
  who,
  context,
}: {
  video: string;
  poster: string;
  label: string;
  duration: string;
  title: string;
  quote: string;
  who: string;
  context: string;
}) {
  return (
    <figure className="flex flex-col">
      <div className="relative overflow-hidden rounded-[22px] bg-surface-deep shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_40px_80px_-30px_rgb(0_0_0/0.9)]">
        <video
          src={video}
          poster={poster}
          controls
          preload="metadata"
          playsInline
          aria-label={label}
          className="block aspect-[596/336] w-full object-cover"
        />
        <PlayBadge duration={duration} />
      </div>
      <p className="mt-6 font-display text-2xl leading-[1.2] font-semibold tracking-[-0.02em] text-ink md:mt-7 md:text-[28px] md:leading-[34px]">
        {title}
      </p>
      <blockquote className="mt-3 text-[17px] leading-[26px] text-ink-3 md:text-[19px] md:leading-7">
        {quote}
      </blockquote>
      <figcaption className="mt-[18px] flex flex-col gap-1">
        <span className="text-[15.5px] font-semibold">{who}</span>
        <span className="text-[15px] leading-[22px] text-ink-4">{context}</span>
      </figcaption>
    </figure>
  );
}
