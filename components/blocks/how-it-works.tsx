import { Notebook } from "@/components/site/illustrations/notebook";
import { PhoneCall } from "@/components/site/illustrations/phone-call";
import { WallCalendar } from "@/components/site/illustrations/wall-calendar";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionLead } from "@/components/site/section-lead";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";

const STEPS = [
  {
    label: "DIAGNOSE",
    title: "We learn how your team works",
    body: "It starts with a free 20-minute call about how your team works now. We tell you the first thing worth building.",
    Illustration: PhoneCall,
  },
  {
    label: "BUILD",
    title: "We build it around your process",
    body: "A system built around your process, not a generic tool bolted on. It learns your method, in your words.",
    Illustration: Notebook,
  },
  {
    label: "RUN",
    title: "Your team uses it every day",
    body: "The team you already have, with your best coaching on every call: a brief before, the next line during, a review after.",
    Illustration: WallCalendar,
  },
];

export function HowItWorks() {
  return (
    <SheetSection variant="b" id="how" aria-label="How it works">
      <SectionEyebrow number="04">HOW IT WORKS</SectionEyebrow>
      <SectionHeading dim="around how your team already sells.">
        Starts in your first month, built
      </SectionHeading>
      <SectionLead className="max-w-[860px]">
        It’s like having the person who knows your business best on every call,
        guiding everyone else. Three steps get you there. The first is a free
        20-minute call, and you’re fully set up within 90 days.
      </SectionLead>

      <div className="mx-auto mt-12 grid max-w-[520px] grid-cols-[minmax(0,1fr)] gap-14 md:mt-[52px] xl:max-w-none xl:grid-cols-[351px_474px_351px] xl:justify-between xl:gap-0">
        {STEPS.map(({ label, title, body, Illustration }, i) => (
          <article key={label} className="flex min-w-0 flex-col">
            <Illustration />
            <div className="mt-[34px] pr-3">
              <p className="flex items-center gap-2.5 text-[12.5px] font-semibold tracking-[0.14em] text-ink-5">
                <span className="flex size-[26px] items-center justify-center rounded-full bg-white/10 text-[13px] tracking-normal text-ink-1 ring-1 ring-white/18 ring-inset">
                  {i + 1}
                </span>
                {label}
              </p>
              <h3 className="mt-3.5 font-display text-[25px] leading-[31px] font-semibold tracking-[-0.02em]">
                {title}
              </h3>
              <p className="mt-2.5 text-[16.5px] leading-[25px] text-ink-3">
                {body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </SheetSection>
  );
}
