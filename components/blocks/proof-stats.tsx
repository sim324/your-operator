import { PEOPLE } from "@/lib/people";
import { Container } from "@/components/site/container";
import { Quote } from "@/components/site/quote";
import { cn } from "@/lib/utils";

const STATS = [
  { value: "25%", label: "growth in a year, after 5 years with no growth" },
  { value: "100+", label: "call reviews a week, up from 15, same team size" },
  {
    value: "2x",
    label: "faster onboarding: new hires ready in under 3 weeks, down from 6",
  },
];

export function ProofStats() {
  return (
    <section
      aria-label="Results in numbers"
      className="relative bg-page pt-10 pb-24 md:pb-32 lg:pb-42"
    >
      <Container>
        <div className="flex flex-col md:flex-row">
          {STATS.map((stat, i) => (
            <div
              key={stat.value}
              className={cn(
                "flex-1 py-8 md:py-0",
                i > 0 &&
                  "border-t border-white/10 md:border-t-0 md:border-l md:pl-10",
                i < STATS.length - 1 && "md:pr-10",
              )}
            >
              <p className="font-display text-6xl leading-none font-bold tracking-[-0.045em] text-ink md:text-7xl">
                {stat.value}
              </p>
              <p className="mt-3.5 max-w-[270px] text-[17px] leading-[25px] text-ink-3">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <Quote
          size="lg"
          className="mt-10 md:mt-16"
          caption="CEO, 70+ person team, on the tools Your Operator built"
          portrait={{ ...PEOPLE.ceo, size: 48 }}
        >
          “This is kind of state-of-the-art use of AI.”
        </Quote>
      </Container>
    </section>
  );
}
