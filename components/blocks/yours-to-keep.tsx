import { BookOpen, KeyRound, Server, type LucideIcon } from "lucide-react";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionLead } from "@/components/site/section-lead";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";

const POINTS: {
  icon: LucideIcon;
  title: string;
  body: string;
  quote?: { text: string; who: string };
  owner?: { label: string; items: string[] };
}[] = [
  {
    icon: BookOpen,
    title: "Your playbook, not a generic one",
    body: "Every tool works from your playbook and your best people’s calls, and nothing else.",
    quote: {
      text: "“Any AI tool that we have is never referring to… arbitrary generic coaching standards.”",
      who: "Head of Coaching, 70+ person team",
    },
  },
  {
    icon: KeyRound,
    title: "You own the IP",
    body: "The playbooks, prompts and knowledge base we create from your team’s expertise belong to you.",
    owner: { label: "YOURS", items: ["Playbooks", "Prompts", "Knowledge base"] },
  },
  {
    icon: Server,
    title: "It runs on our platform",
    body: "We host it, run it and keep improving it, so your team just uses it. There’s no software for you to build or look after.",
    owner: { label: "OURS", items: ["The platform", "Hosting", "Updates"] },
  },
];

export function YoursToKeep() {
  return (
    <SheetSection variant="a" id="yours" aria-label="Yours to keep">
      <SectionEyebrow number="07">YOURS TO KEEP</SectionEyebrow>
      <SectionHeading dim="Yours to keep.">
        Built from your expertise.
      </SectionHeading>
      <SectionLead className="max-w-[820px]">
        We don’t sell a generic coach. We turn how your best people sell into
        playbooks, prompts and a knowledge base made only for your company. That
        IP is yours. It runs on the Your Operator platform.
      </SectionLead>

      <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-x-12">
        {POINTS.map(({ icon: Icon, title, body, quote, owner }) => (
          <div key={title} className="border-t border-white/12 pt-6">
            <Icon
              className="size-[22px] text-azure-200"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <p className="mt-4 font-display text-[22px] leading-7 font-semibold tracking-[-0.015em] text-ink">
              {title}
            </p>
            <p className="mt-2.5 text-base leading-6 text-ink-3">{body}</p>
            {quote && (
              <blockquote className="mt-[18px] text-base leading-6 text-ink-2">
                {quote.text}
                <span className="mt-2 block text-[13.5px] text-ink-4">
                  {quote.who}
                </span>
              </blockquote>
            )}
            {owner && (
              <div className="mt-[18px] flex flex-col gap-2.5 border-t border-white/10 pt-[18px]">
                <span className="text-xs font-semibold tracking-[0.14em] text-ink-6">
                  {owner.label}
                </span>
                <span className="flex flex-wrap gap-2">
                  {owner.items.map((item) => (
                    <span
                      key={item}
                      className="flex h-[30px] items-center rounded-full bg-white/5 px-3 text-sm text-ink-2 ring-1 ring-white/10 ring-inset"
                    >
                      {item}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-3 border-t border-white/12 pt-7 md:mt-14 md:grid-cols-[340px_minmax(0,1fr)] md:items-baseline md:gap-12">
        <p className="font-display text-2xl leading-[30px] font-semibold tracking-[-0.015em] text-ink">
          Who owns what you build?
        </p>
        <p className="text-[17px] leading-7 text-ink-3 md:text-lg">
          You do: the playbooks, prompts and knowledge base we create from your
          team’s expertise. If you ever leave, all of it goes with you. The
          platform that runs it stays with us.
        </p>
      </div>
    </SheetSection>
  );
}
