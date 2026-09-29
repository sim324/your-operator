import { SectionLead } from "@/components/site/section-lead";
import { Check, Clock, Eye, Phone, type LucideIcon } from "lucide-react";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";

const ROWS: {
  icon: LucideIcon;
  today: string;
  fixed: string;
  area: string;
}[] = [
  {
    icon: Eye,
    today:
      "Only a small number of calls or conversations ever get reviewed, so you find a problem after it’s already cost you.",
    fixed: "Every call reviewed.",
    area: "Call reviews",
  },
  {
    icon: Clock,
    today:
      "New hires take weeks to get up to speed because your best performer’s method has never been written down.",
    fixed: "Every new hire ready in weeks, not months.",
    area: "Practice and training",
  },
  {
    icon: Phone,
    today: "Leads go cold before anyone follows up with them.",
    fixed: "Every lead followed up before it goes cold.",
    area: "Lead follow-up",
  },
];

const colLabel = "text-[13px] font-semibold tracking-[0.16em]";

export function Problem() {
  return (
    <SheetSection variant="a" id="problem" aria-label="The problem we fix">
      <SectionEyebrow number="01">THE PROBLEM</SectionEyebrow>
      <SectionHeading dim="in one person’s head.">
        Your best rep’s method lives
      </SectionHeading>
      <SectionLead className="max-w-[760px]">
        Or in a spreadsheet, or across different tools. Not in a system. Whether
        your team is coaches, a front desk, or sales reps, the same problems show
        up.
      </SectionLead>

      <div className="mt-12 md:mt-16">
        <div className="mb-[18px] hidden grid-cols-2 gap-x-[72px] md:grid">
          <p className={`${colLabel} text-ink-6`}>TODAY</p>
          <p className={`${colLabel} text-azure-300`}>WITH YOUR OPERATOR</p>
        </div>
        {ROWS.map(({ icon: Icon, today, fixed, area }) => (
          <div key={area} className="grid md:grid-cols-2 md:gap-x-[72px]">
            <div className="border-t border-white/8 py-6 md:py-[26px]">
              <p className={`${colLabel} mb-3 text-ink-6 md:hidden`}>TODAY</p>
              <div className="flex items-center gap-[18px]">
                <Icon
                  className="size-5 shrink-0 text-ink-dim opacity-80"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <p className="text-[17.5px] leading-[26px] text-ink-4">{today}</p>
              </div>
            </div>
            <div className="border-t border-white/12 py-6 md:py-[26px]">
              <p className={`${colLabel} mb-3 text-azure-300 md:hidden`}>
                WITH YOUR OPERATOR
              </p>
              <div className="flex items-center gap-[18px]">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink-1 shadow-[0_8px_18px_-8px_rgb(0_0_0/0.7)]">
                  <Check
                    className="size-4 text-surface"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                </span>
                <p className="flex flex-col gap-[3px]">
                  <span className="font-display text-xl leading-[1.25] font-semibold tracking-[-0.015em] text-ink md:text-2xl md:leading-[30px]">
                    {fixed}
                  </span>
                  <span className="text-sm text-ink-6">{area}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SheetSection>
  );
}
