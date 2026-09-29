import { ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/site/glass-panel";
import { Milestone } from "@/components/site/milestone";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionLead } from "@/components/site/section-lead";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";
import { TestimonialCard } from "@/components/site/testimonial-card";

const BEFORE_AFTER = [
  { before: ["5 years", "with no growth"], after: ["25%", "growth in a year"] },
  {
    before: ["15", "call reviews a week"],
    after: ["100+", "call reviews a week, same team size"],
  },
  {
    before: ["6 weeks", "to onboard a new hire"],
    after: ["Under 3 weeks", "to onboard a new hire"],
  },
];

const MONTH_3 = [
  {
    video: "/assets/testimonials/ceo-month3-growth.mp4",
    poster: "/assets/testimonials/ceo-month3-growth-poster.jpg",
    label: "The CEO, three months in, on the company’s growth",
    duration: "0:06",
    title: "20% growth, three months in",
    quote:
      "“In terms of the company, this is like our peak performance, right? We grew like 20% already. We’re going to grow 25%.”",
    who: "CEO · 70+ person team",
    context:
      "Three months in: the quarter the AI intake conversation Sim rewrote broke their records.",
  },
  {
    video: "/assets/testimonials/hoc-month3-intake.mp4",
    poster: "/assets/testimonials/hoc-month3-intake-poster.jpg",
    label:
      "The Head of Coaching, three months in, on Sim’s work on their intake",
    duration: "0:09",
    title: "Sim went through all of their intake data",
    quote:
      "“I want to give a shout out to Sim… incredibly helpful with this, going through all of our intake data to try to figure out where we can tighten up our approach the most.”",
    who: "Head of Coaching · same team",
    context:
      "On Sim’s intake work. Her rewrite of their AI intake conversation brought in 1.5x the revenue in an A/B test.",
  },
];

const MONTH_6 = [
  {
    video: "/assets/testimonials/ceo-month6-target.mp4",
    poster: "/assets/testimonials/ceo-month6-target-poster.jpg",
    label: "The CEO, at the end of the project, on reaching 25% growth",
    duration: "0:09",
    title: "Target hit: 25% growth in a year",
    quote:
      "“In 2025, our goal is to grow the business by 25%… So we successfully did it… 25% growth is not too shabby at all.”",
    who: "CEO · same team",
    context:
      "The year Sim built their system and playbooks while learning their method.",
  },
  {
    video: "/assets/testimonials/hoc-month6-chatgpt.mp4",
    poster: "/assets/testimonials/hoc-month6-chatgpt-poster.jpg",
    label:
      "The Head of Coaching, at the end of the project, on learning to build with AI and on the training platform Sim led",
    duration: "0:28",
    title: "From barely using ChatGPT to building AI systems",
    quote:
      "“Prior to January, I had maybe used ChatGPT two or three times. And here I am… building these agentic systems… This is Sim’s brainchild.”",
    who: "Head of Coaching · same team",
    context:
      "Sim taught him to build with AI, starting with the coaches’ training textbook he wrote and released with it, and led the training platform he describes. Two moments from the same meeting.",
  },
  {
    video: "/assets/testimonials/hoc-month6-reviews.mp4",
    poster: "/assets/testimonials/hoc-month6-reviews-poster.jpg",
    label: "The Head of Coaching on the AI call reviews",
    duration: "0:13",
    title: "Reviews that match their Head of Coaching",
    quote:
      "“When you get these reviews, they really are like 98, 99% aligned with exactly what I’d say.”",
    who: "Head of Coaching · same team",
    context:
      "Your Operator designed and built three custom AI tools to scale his impact.",
  },
  {
    video: "/assets/testimonials/ceo-month6-simulate.mp4",
    poster: "/assets/testimonials/ceo-month6-simulate-poster.jpg",
    label: "The CEO of a 70+ person team on the AI tools Your Operator built",
    duration: "0:24",
    title: "Their best coach’s thinking, on every call",
    quote:
      "“This is kind of state-of-the-art use of AI… We’re basically using AI to simulate [our Head of Coaching’s] brain.”",
    who: "CEO · 70+ person team",
    context:
      "On the AI tools Your Operator built for the Head of Coaching, who is responsible for the performance of 70+ coaches.",
  },
];

const colLabel = "text-[12.5px] font-semibold tracking-[0.14em]";
const grid = "md:grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)]";

function Figure({
  value,
  text,
  muted,
}: {
  value: string;
  text: string;
  muted?: boolean;
}) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span
        className={`shrink-0 font-display text-4xl leading-none font-bold tracking-[-0.03em] whitespace-nowrap md:text-[44px] ${muted ? "text-ink-6" : "text-ink"}`}
      >
        {value}
      </span>
      <span
        className={`text-base leading-[1.4] md:text-lg ${muted ? "text-ink-6" : "text-ink-2"}`}
      >
        {text}
      </span>
    </p>
  );
}

function Videos({ items }: { items: typeof MONTH_3 }) {
  return (
    <div className="mt-6 grid gap-x-12 gap-y-14 md:grid-cols-2">
      {items.map((item) => (
        <TestimonialCard key={item.video} {...item} />
      ))}
    </div>
  );
}

export function Results() {
  return (
    <SheetSection variant="a" id="results" aria-label="Results">
      <SectionEyebrow number="05">RESULTS</SectionEyebrow>
      <SectionHeading dim="after 5 years with no growth.">
        One team grew 25% in a year,
      </SectionHeading>
      <SectionLead className="max-w-[820px]">
        One client, a 70+ person service and sales team whose revenue depends on
        how well each person handles a call. Sim spent six months building their
        system while learning exactly how their top-selling coach worked. Here
        is what changed, in numbers and in their own words.
      </SectionLead>

      <GlassPanel className="mt-12 rounded-[28px] px-5 pt-6 pb-3 sm:px-9 sm:pt-[30px] sm:pb-[18px]">
        <div className="mb-[22px] flex items-center justify-between gap-4">
          <span className="font-display text-xl font-semibold tracking-[-0.01em] text-ink">
            Service and sales team
          </span>
          <span className="flex h-[26px] items-center rounded-full bg-white/[0.045] px-2.5 text-[11.5px] font-semibold tracking-[0.12em] whitespace-nowrap text-ink-3 ring-1 ring-white/7 ring-inset">
            70+ PEOPLE
          </span>
        </div>
        <div className={`hidden pb-3.5 md:grid ${grid}`}>
          <span className={`${colLabel} text-ink-6`}>BEFORE</span>
          <span />
          <span className={`${colLabel} text-azure-300`}>BY THE END OF 2025</span>
        </div>
        {BEFORE_AFTER.map(({ before, after }) => (
          <div
            key={before[0]}
            className={`grid items-center gap-3 border-t border-white/8 py-[18px] ${grid}`}
          >
            <div>
              <p className={`${colLabel} mb-2 text-ink-6 md:hidden`}>BEFORE</p>
              <Figure value={before[0]} text={before[1]} muted />
            </div>
            <ArrowRight
              className="size-[22px] rotate-90 justify-self-start text-azure-300 md:justify-self-center md:rotate-0"
              strokeWidth={2.2}
              aria-hidden="true"
            />
            <div>
              <p className={`${colLabel} mb-2 text-azure-300 md:hidden`}>
                BY THE END OF 2025
              </p>
              <Figure value={after[0]} text={after[1]} />
            </div>
          </div>
        ))}
      </GlassPanel>

      <Milestone
        className="mt-14 md:mt-16"
        label="MONTH 3"
        date="September 2025 · three months into the build"
        lead="Built so far:"
      >
        the AI intake conversation Sim rewrote (1.5x the revenue in an A/B
        test), the coaches’ training textbook, which Sim taught the Head of
        Coaching to write and release with AI, and an upgraded AI assistant for
        training.
      </Milestone>
      <Videos items={MONTH_3} />

      <Milestone
        className="mt-16 md:mt-[72px]"
        label="MONTH 6"
        date="December 2025 · the build complete"
        lead="Added by the finish:"
      >
        AI session reviews that save 20+ manager-hours a week, a live sales
        assistant used company-wide, a voice practice agent, and the full
        training platform.
      </Milestone>
      <Videos items={MONTH_6} />
    </SheetSection>
  );
}
