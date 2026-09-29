import { SectionLead } from "@/components/site/section-lead";
import { Portrait } from "@/components/site/portrait";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";
import { TextLink } from "@/components/site/text-link";

const CREDENTIALS = [
  "Certified solution-focused, life and relationship coach, with ICF-approved continuing coach education",
  "Triple-major degree from the University of Cape Town, Africa’s top-ranked university",
  "Worked in the Women24 section of News24, South Africa’s most-read news site",
  "Published her first novel at 23",
];

export function Founder() {
  return (
    <SheetSection variant="b" aria-label="Who builds it">
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-12 lg:gap-[72px]">
        <Portrait
          src="/assets/people/sim.jpg"
          alt="Sim, the founder of Your Operator"
          size={240}
          ring="lg"
          className="w-40 md:w-[240px]"
        />
        <div>
          <SectionEyebrow number="02">WHO BUILDS IT</SectionEyebrow>
          <SectionHeading size="md">
            Built by someone who did the work first.
          </SectionHeading>
          <SectionLead className="max-w-[820px] text-ink-2">
            Our founder, Sim, has coached clients in private sessions for seven
            years, and at a 70+ person coaching company she also trained new
            coaches. In 2025 she built the company’s AI system, studying exactly
            how its top-selling coach worked. In the first three months, the AI
            intake conversation she rewrote broke the company’s records. That
            year, the company grew 25%.
          </SectionLead>
          <p className="mt-3.5 max-w-[820px] text-[17px] leading-7 text-ink-4 md:text-lg">
            Too much of what drives your revenue depends on a person, not a
            system. Every system we build, we’ve used ourselves first.
          </p>
          <ul className="mt-[22px] grid gap-x-8 gap-y-2.5 text-base leading-6 text-ink-4 sm:grid-cols-2">
            {CREDENTIALS.map((c) => (
              <li key={c} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 size-1 shrink-0 rounded-full bg-azure-300/70"
                />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-[26px]">
            <TextLink href="/about" className="text-base font-semibold">
              Read Sim’s story
            </TextLink>
          </p>
        </div>
      </div>
    </SheetSection>
  );
}
