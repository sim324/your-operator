import { PEOPLE } from "@/lib/people";
import { BookCallButton } from "@/components/site/book-call-button";
import { CheckItem } from "@/components/site/check-item";
import { Container } from "@/components/site/container";
import { Quote } from "@/components/site/quote";
import { SiteHeader } from "@/components/site/site-header";
import { TextLink } from "@/components/site/text-link";
import { FilmPlayer } from "@/components/site/film-player";
import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <section
      aria-label="Your Operator"
      className="bg-hero relative overflow-hidden pt-28 pb-12 md:pt-[150px] md:pb-14"
    >
      <SiteHeader />
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_504px] lg:gap-x-16 xl:gap-x-[8px]">
          <div>
            <h1 className="font-display text-[44px] leading-[1.05] font-bold tracking-[-0.045em] text-ink sm:text-6xl md:text-[68px] lg:text-[76px] lg:leading-20 xl:whitespace-nowrap">
              Your best coaching,
              <br />
              in every call.
            </h1>
            <Quote
              className="mt-6 gap-3 md:mt-[26px]"
              size="sm"
              caption="Head of Coaching, 70+ person team, on the call reviews"
              portrait={{ ...PEOPLE.headOfCoaching, size: 34, priority: true }}
            >
              <span className="text-[15px] text-ink-1">
                “98, 99% aligned with exactly what I’d say.”
              </span>
            </Quote>
          </div>

          <div className="lg:pt-1.5">
            <p className="text-lg leading-[1.55] text-ink-3 md:text-xl md:leading-[31px]">
              We build an AI system around how your best people already sell, so
              the rest of your team sells that way too. It starts in your first
              month.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-[22px] gap-y-4">
              <BookCallButton />
              <TextLink href={SITE.demo} className="text-[15.5px]">
                or try the demo
              </TextLink>
            </div>
            <ul className="mt-[18px] flex flex-wrap gap-x-[18px] gap-y-2 text-[13.5px] text-ink-4">
              {SITE.trust.map((t) => (
                <li key={t}>
                  <CheckItem>{t}</CheckItem>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FilmPlayer
          className="mt-12 md:mt-[62px]"
          loopSrc="/assets/video/hero-loop.mp4"
          loopPoster="/assets/video/hero-loop-poster.jpg"
          loopLabel="A live call in Your Operator: Dana on camera, the rep in the corner, and Paige’s next line on the right, which only the rep sees"
          filmSrc="/assets/video/film-full-web.mp4"
          filmPoster="/assets/video/film-full-poster.jpg"
          filmLabel="How Your Operator works, a two-minute film with Paige"
          aspect="aspect-[1212/757]"
          openText="Play video"
          openAria="Play the two-minute film, with sound"
          closeText="Close video"
          caption="From the demo: a live call. Only the rep sees Paige’s panel."
        />
      </Container>
    </section>
  );
}
