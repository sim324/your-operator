import { SectionLead } from "./section-lead";
import { BookCallButton } from "./book-call-button";
import { CheckItem } from "./check-item";
import { LogoMark } from "./logo";
import { SectionHeading } from "./section-heading";
import { TextLink } from "./text-link";
import { SITE } from "@/lib/site";

/** The closing ask: logo, big heading, one button, and the three reassurances. */
export function FinalCta({
  heading,
  dim,
  body,
  children,
  className,
}: {
  heading: React.ReactNode;
  dim: React.ReactNode;
  body: React.ReactNode;
  /** Optional extra content under the trust row, e.g. a quote. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${className ?? ""}`}>
      <LogoMark width={48} />
      <SectionHeading size="xl" dim={dim} className="mt-7">
        {heading}
      </SectionHeading>
      <SectionLead className="max-w-[680px] text-ink-lead">
        {body}
      </SectionLead>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
        <BookCallButton size="cta-xl" />
        <TextLink href={SITE.demo} className="text-base">
          or try the demo
        </TextLink>
      </div>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink-4">
        {SITE.trust.map((t) => (
          <li key={t}>
            <CheckItem>{t}</CheckItem>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}
