import { Check, MessageSquare, PenLine, Users, type LucideIcon } from "lucide-react";
import { GlassPanel } from "@/components/site/glass-panel";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionLead } from "@/components/site/section-lead";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";

const CARDS: {
  icon: LucideIcon;
  title: string;
  body: string;
  points: string[];
}[] = [
  {
    icon: MessageSquare,
    title: "A coach’s ear for the call",
    body: "Seven years of sessions taught me to hear what’s really going on in a conversation, and what makes someone say yes to the next step. That’s how I find what your best people do that the rest of your team doesn’t.",
    points: [
      "Certified solution-focused, life and relationship coach",
      "ICF-approved continuing coach education",
      "Seven years of private sessions, and 62+ five-star reviews",
    ],
  },
  {
    icon: PenLine,
    title: "A writer’s ear for words",
    body: "AI runs on words. The prompts, scripts and training guides behind your system should sound like your best person, not like software. That’s writing, and it’s been my craft from the start.",
    points: [
      "Triple major, including English and communications, at the University of Cape Town, Africa’s top-ranked university",
      "Worked in the Women24 section of News24, South Africa’s most-read news site",
      "First novel published at 23",
    ],
  },
  {
    icon: Users,
    title: "A trainer who brings teams along",
    body: "I trained new coaches for years, and taught a Head of Coaching who had barely used ChatGPT to build with AI. I build every system so your team will actually use it.",
    points: ["Taught its Head of Coaching to build with AI in 2025"],
  },
];

export function WhyItWorks() {
  return (
    <SheetSection variant="b" id="why" aria-label="Why the systems I build work">
      <SectionEyebrow number="02">WHY IT WORKS</SectionEyebrow>
      <SectionHeading size="mid" dim="I build work.">
        Why the systems
      </SectionHeading>
      <SectionLead size="md" className="max-w-[780px]">
        Most AI tools are built by engineers. Mine start from the calls
        themselves: what your best people say, and why it works.
      </SectionLead>

      <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
        {CARDS.map(({ icon: Icon, title, body, points }) => (
          <GlassPanel
            key={title}
            className="flex flex-col rounded-[26px] px-6 pt-8 pb-[30px] transition-transform duration-[250ms] hover:-translate-y-1 sm:px-[30px]"
          >
            <span className="flex size-[50px] items-center justify-center rounded-[15px] bg-brand/16 ring-1 ring-azure-300/28 ring-inset">
              <Icon
                className="size-[23px] text-azure-200"
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>
            <h3 className="mt-6 font-display text-2xl leading-[1.2] font-semibold tracking-[-0.02em] text-ink md:text-[26px] md:leading-[31px]">
              {title}
            </h3>
            <p className="mt-3 text-[17px] leading-[26px] text-ink-3">{body}</p>
            <ul className="mt-6 flex flex-col gap-2.5 border-t border-white/9 pt-5 text-[14.5px] leading-[21px] text-ink-4">
              {points.map((p) => (
                <li key={p} className="flex gap-2.5">
                  <Check
                    className="mt-1 size-3.5 shrink-0 text-azure-300"
                    strokeWidth={2.6}
                    aria-hidden="true"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        ))}
      </div>
    </SheetSection>
  );
}
