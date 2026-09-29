import { SectionLead } from "@/components/site/section-lead";
import { BookCallButton } from "@/components/site/book-call-button";
import { Container } from "@/components/site/container";
import { Glow } from "@/components/site/glow";
import { GlassPanel } from "@/components/site/glass-panel";
import { Portrait } from "@/components/site/portrait";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SiteHeader } from "@/components/site/site-header";
import { StarRating } from "@/components/site/star-rating";
import { TextLink } from "@/components/site/text-link";

export function AboutHero() {
  return (
    <section
      aria-label="About Sim"
      className="bg-hero relative overflow-hidden pt-28 md:pt-[176px]"
    >
      <SiteHeader current="about" />
      <Container>
        <SectionEyebrow>MEET THE FOUNDER</SectionEyebrow>
        <h1 className="font-display text-[40px] leading-[1.08] font-bold tracking-[-0.045em] text-ink sm:text-6xl md:text-[64px] lg:text-[72px] lg:leading-[78px]">
          I spent seven years on the calls.
          <span className="block text-azure-300">
            Now I build the AI behind them.
          </span>
        </h1>

        <div className="mt-10 grid items-center gap-12 md:mt-12 lg:grid-cols-[minmax(0,720px)_400px] lg:justify-between">
          <div>
            <p className="max-w-[700px] font-display text-2xl leading-[1.3] font-semibold tracking-[-0.02em] text-ink-1 md:text-[28px] md:leading-9">
              I turn the way your best people sell into a system your whole team
              uses.
            </p>
            <SectionLead size="md" className="max-w-[712px]">
              Hi ✨ I’m Sim Sibanda, a certified solution-focused, life and
              relationship coach. I’ve coached clients in private sessions for
              seven years. At the 70+ person coaching company where I worked,
              every session was also a sale: the next booking is how the
              business grew. In 2025 I built the AI system that taught its
              coaches to sell like the coach who was best at sales. That year,
              the company grew 25% after five flat years.
            </SectionLead>
            <p className="mt-3.5 max-w-[690px] text-[17px] leading-7 text-ink-4 md:text-lg">
              I work with teams like yours, anywhere in the world.
            </p>
            <div className="mt-[34px] flex flex-wrap items-center gap-x-[22px] gap-y-4">
              <BookCallButton />
              <TextLink href="/#results" className="text-[15.5px]">
                or see the results
              </TextLink>
            </div>
          </div>

          <GlassPanel
            className="mx-auto flex w-full max-w-[400px] flex-col items-center rounded-[32px] px-9 pt-10 pb-8 text-center"
          >
            <div className="relative">
              <Glow
                alpha={0.28}
                rgb="96 165 250"
                className="-top-[60px] -left-[60px] size-[340px]"
              />
              <Portrait
                src="/assets/people/sim.jpg"
                alt="Sim Sibanda, founder of Your Operator"
                size={220}
                ring="lg"
                priority
                className="relative"
              />
            </div>
            <div className="mt-[30px] flex w-full flex-col items-center">
              <span className="font-display text-[30px] leading-9 font-bold tracking-[-0.025em] text-ink">
                Sim Sibanda
              </span>
              <span className="mt-1 text-base text-ink-4">
                Founder, Your Operator
              </span>
              <span className="mt-[22px] h-px w-full bg-white/10" />
              <StarRating className="mt-5" />
              <span className="mt-2 text-[15px] leading-[22px] text-ink-2">
                62+ five-star reviews from
                <br />
                my coaching clients
              </span>
            </div>
          </GlassPanel>
        </div>
      </Container>
    </section>
  );
}
