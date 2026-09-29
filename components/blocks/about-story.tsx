import { PEOPLE } from "@/lib/people";
import { GlassPanel } from "@/components/site/glass-panel";
import { Portrait } from "@/components/site/portrait";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";
import { cn } from "@/lib/utils";

type Para = string | { lead: string; text: string };

const QUOTES = [
  {
    text: "“Prior to January, I had maybe used ChatGPT two or three times. And here I am… building these agentic systems… This is Sim’s brainchild.”",
    who: "Head of Coaching, 70+ person team, December 2025",
    portrait: PEOPLE.headOfCoaching,
  },
  {
    text: "“We’re basically using AI to simulate [our Head of Coaching’s] brain.”",
    who: "CEO, 70+ person team",
    portrait: PEOPLE.ceo,
  },
];

const TIMELINE: { label: string; title: string; body: Para[] }[] = [
  {
    label: "BEFORE COACHING",
    title: "Words first",
    body: [
      "After graduating from the University of Cape Town, Africa’s top-ranked university, with a triple major that included English and communications, I went on to work in the Women24 section of News24, South Africa’s most-read news site. I published my first novel at 23.",
    ],
  },
  {
    label: "THE COACH",
    title: "Seven years of private sessions",
    body: [
      "I trained as a certified solution-focused, life and relationship coach, with ICF-approved continuing coach education. I’ve coached clients in private sessions for seven years, and at a 70+ person coaching company I also trained new coaches.",
      "Every session there was also a sale: the next booking is how the business grew. Their top-selling coach had mastered it, and that’s what I later built into AI.",
    ],
  },
  {
    label: "2025 · TEACHING",
    title: "Teaching their Head of Coaching to use AI",
    body: [
      "In 2025 I pitched the company an AI system, and they brought me in to build it. I began with their Head of Coaching, who had used ChatGPT only two or three times. I taught him to work with AI, and he wrote and released the coaches’ training textbook with it. By December, he was building AI systems of his own.",
    ],
  },
  {
    label: "2025 · BUILDING",
    title: "Building the system",
    body: [
      "I spent six months learning the business and deciding what to build, then six months building it, studying exactly how their top-selling coach worked.",
      {
        lead: "First three months:",
        text: "the AI intake conversation I rewrote brought in 1.5x the revenue in an A/B test and broke the company’s records. I also upgraded the AI assistant the coaches train with.",
      },
      {
        lead: "By year’s end:",
        text: "AI session reviews that save managers 20+ hours a week, a live sales assistant used across the company, a voice agent for practice, and a complete training platform. The company grew 25% after five flat years.",
      },
    ],
  },
  {
    label: "NOW",
    title: "Your Operator",
    body: [
      "I build agentic AI systems that help everyone on your team sell like the person who does it best. I start by learning your whole business: your customers, your offer, your constraints, and how your best person sells within them. Then I build that into a system that’s with every person on every call, guiding them the way your best person would. It’s built for you alone, and the IP is yours.",
    ],
  },
];

export function AboutStory() {
  return (
    <SheetSection variant="a" id="story" aria-label="My story">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,440px)_minmax(0,680px)] lg:justify-between lg:gap-x-12">
        <div>
          <SectionEyebrow number="01">MY STORY</SectionEyebrow>
          <SectionHeading size="mid">How I got here.</SectionHeading>
          <p className="mt-[22px] text-[17px] leading-[1.6] text-ink-4 md:text-[19px] md:leading-[30px]">
            I came to AI from coaching and writing, not from software. Each one
            shapes how I build.
          </p>
          <GlassPanel className="mt-10 rounded-3xl px-5 py-2 sm:px-7 lg:mt-11">
            {QUOTES.map((q, i) => (
              <figure
                key={q.who}
                className={cn(
                  "flex items-start gap-4 py-[22px]",
                  i > 0 && "border-t border-white/8",
                )}
              >
                <Portrait {...q.portrait} size={46} />
                <div>
                  <blockquote className="text-lg leading-[26px] font-medium text-ink-1">
                    {q.text}
                  </blockquote>
                  <figcaption className="mt-1 text-sm leading-5 text-ink-5">
                    {q.who}
                  </figcaption>
                </div>
              </figure>
            ))}
          </GlassPanel>
        </div>

        <ol className="m-0 list-none p-0 pl-px lg:mt-2">
          {TIMELINE.map((item, i) => {
            const last = i === TIMELINE.length - 1;
            return (
              <li
                key={item.title}
                className={cn("relative pl-11", !last && "pb-[52px]")}
              >
                {last ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1 -left-[7px] size-3.5 rounded-full bg-brand shadow-[0_0_0_5px_rgb(47_107_255/0.22),0_0_18px_rgb(96_165_250/0.7)]"
                  />
                ) : (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute top-5 -bottom-1 -left-px w-0.5 bg-linear-to-b from-azure-300/45 to-azure-300/18"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-[5px] -left-1.5 size-3 rounded-full bg-surface shadow-[inset_0_0_0_2px_var(--color-azure-300)]"
                    />
                  </>
                )}
                <p
                  className={cn(
                    "text-[12.5px] font-semibold tracking-[0.14em]",
                    last ? "text-azure-300" : "text-ink-6",
                  )}
                >
                  {item.label}
                </p>
                <h3 className="mt-2.5 font-display text-2xl leading-[1.2] font-semibold tracking-[-0.02em] text-ink md:text-[30px] md:leading-9">
                  {item.title}
                </h3>
                {item.body.map((para, j) => (
                  <p
                    key={j}
                    className="mt-3 text-[17px] leading-[27px] text-ink-3 md:text-lg md:leading-7"
                  >
                    {typeof para === "string" ? (
                      para
                    ) : (
                      <>
                        <span className="font-semibold text-ink-1">
                          {para.lead}
                        </span>{" "}
                        {para.text}
                      </>
                    )}
                  </p>
                ))}
              </li>
            );
          })}
        </ol>
      </div>
    </SheetSection>
  );
}
