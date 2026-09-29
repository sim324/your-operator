import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

const STATS = [
  {
    value: "25%",
    label: "growth in 2025, the year I built their system, after five flat years",
  },
  {
    value: "1.5x",
    label: "the revenue from the AI intake conversation I rewrote, in an A/B test",
  },
  {
    value: "20+",
    label: "manager-hours saved a week by the AI session reviews I built",
  },
];

export function AboutStats() {
  return (
    <section
      aria-label="Sim in numbers"
      className="relative bg-page pt-20 pb-28 md:pt-24 md:pb-36 lg:pt-30 lg:pb-42"
    >
      <Container>
        <div className="grid border-t border-white/10 pt-10 md:grid-cols-3">
          {STATS.map((stat, i) => (
            <div
              key={stat.value}
              className={cn(
                "flex flex-col gap-2.5 py-6 md:py-0 md:pr-8",
                i > 0 &&
                  "border-t border-white/10 md:border-t-0 md:border-l md:pl-8",
              )}
            >
              <span className="font-display text-[44px] leading-none font-bold tracking-[-0.035em] text-ink md:text-[52px]">
                {stat.value}
              </span>
              <span className="text-base leading-6 text-ink-4">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
