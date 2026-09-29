"use client";

import Image from "next/image";
import { useState } from "react";
import { Glow } from "@/components/site/glow";
import { GlassPanel } from "@/components/site/glass-panel";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionLead } from "@/components/site/section-lead";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";
import { TextLink } from "@/components/site/text-link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SITE } from "@/lib/site";

const SCREENS = [
  {
    id: "brief",
    name: "The brief",
    src: "/assets/platform/brief.webp",
    line: "Before the call: what the lead said, what the problem costs them, and a plan.",
  },
  {
    id: "live",
    name: "Live call",
    src: "/assets/platform/live-call.webp",
    line: "During the call, Paige shows the next line. Only your team member sees it.",
  },
  {
    id: "practice",
    name: "Practice",
    src: "/assets/platform/practice.webp",
    line: "Rehearse the exact moment with an AI voice built from real calls.",
  },
  {
    id: "team",
    name: "Team",
    src: "/assets/platform/team.webp",
    line: "Managers see who needs help, with the message already written.",
  },
];

export function Platform() {
  const [tab, setTab] = useState(SCREENS[0].id);

  return (
    <SheetSection variant="b" id="platform" aria-label="The platform">
      <Tabs value={tab} onValueChange={setTab} className="gap-0">
        <div className="flex flex-col items-center text-center">
          <SectionEyebrow number="06">THE PLATFORM</SectionEyebrow>
          <SectionHeading>See what your team sees on every call.</SectionHeading>
          <SectionLead>
            Before, during and after each call. Shown with Halden Freight, a
            sample company we set up for the demo.
          </SectionLead>
          <GlassPanel className="mt-10 w-full max-w-full rounded-full p-1.5 sm:w-auto">
            <TabsList
              aria-label="Screens"
              className="flex h-auto w-full gap-1 bg-transparent p-0 sm:w-auto"
            >
              {SCREENS.map((s) => (
                <TabsTrigger
                  key={s.id}
                  value={s.id}
                  className="h-10 flex-1 rounded-full px-3 text-sm font-medium text-ink-3 hover:text-white data-active:bg-ink-1 data-active:text-surface data-active:shadow-chip sm:h-11 sm:flex-none sm:px-[18px] sm:text-[15px] dark:data-active:bg-ink-1 dark:data-active:text-surface"
                >
                  {s.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </GlassPanel>
        </div>

        <div className="relative mt-8">
          <Glow
            alpha={0.24}
            className="-top-8 left-1/2 h-[90%] w-[88%] -translate-x-1/2"
          />
          {SCREENS.map((s) => (
            <TabsContent key={s.id} value={s.id}>
              <GlassPanel
                variant="frame"
                className="relative rounded-[20px] p-1.5 sm:p-2.5 md:rounded-[30px]"
              >
                <div className="overflow-x-auto rounded-[14px] bg-surface sm:rounded-[21px] md:overflow-hidden">
                  <div className="relative aspect-[1212/757] min-w-[780px] animate-shot-in md:min-w-0">
                    <Image
                      src={s.src}
                      alt={`Your Operator: ${s.name} screen`}
                      fill
                      sizes="(min-width: 1312px) 1212px, (min-width: 768px) 100vw, 780px"
                      className="object-cover object-left-top"
                    />
                  </div>
                </div>
              </GlassPanel>
              <div className="mt-[22px] flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-[22px]">
                <p className="text-base leading-[25px] text-ink-3 md:text-[17px]">
                  {s.line}
                </p>
                <span
                  aria-hidden="true"
                  className="hidden h-4 w-px bg-white/16 sm:block"
                />
                <TextLink href={SITE.demo} className="text-[15px]">
                  Try it in the demo
                </TextLink>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </SheetSection>
  );
}
