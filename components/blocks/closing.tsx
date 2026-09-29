import { PEOPLE } from "@/lib/people";
import { SectionLead } from "@/components/site/section-lead";
import Image from "next/image";
import { Glow } from "@/components/site/glow";
import { FinalCta } from "@/components/site/final-cta";
import { Quote } from "@/components/site/quote";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";
import { SiteFooter } from "@/components/site/site-footer";

const ROOMS = [
  { src: "/assets/rooms/pink.webp", height: 340 },
  { src: "/assets/rooms/green-study.webp", height: 325 },
  { src: "/assets/rooms/sunny.webp", height: 309 },
];

/** Rooms people can pick, then the final ask and the footer, on one last sheet. */
export function Closing() {
  return (
    <SheetSection
      variant="b"
      id="book"
      aria-label="Book a free 20-minute call"
      tightBottom
    >
      <div className="flex flex-col items-center text-center">
        <SectionEyebrow number="08">YOUR TEAM’S SPACE</SectionEyebrow>
        <SectionHeading dim="for everyone on your team.">
          A room of their own,
        </SectionHeading>
        <SectionLead>
          Calls on the phone, practice on the shelf, Paige on the TV. Each
          person picks the look.
        </SectionLead>
      </div>

      <div
        role="img"
        aria-label="Three rooms people can pick: a pink one with fairy lights, a dark green study, and a sunny one full of plants"
        className="relative mt-12 grid grid-cols-1 items-end gap-8 sm:grid-cols-3 sm:gap-4 md:mt-14 lg:gap-0 lg:[grid-template-columns:repeat(3,400px)] lg:justify-between"
      >
        <Glow
          alpha={0.22}
          className="-top-10 left-1/2 hidden h-115 w-[min(1000px,90%)] -translate-x-1/2 sm:block"
        />
        {ROOMS.map((room) => (
          <Image
            key={room.src}
            src={room.src}
            alt=""
            width={800}
            height={room.height * 2}
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 33vw, 100vw"
            className="relative mx-auto block h-auto w-full max-w-100 [filter:drop-shadow(0_40px_40px_rgb(0_0_0/0.55))_drop-shadow(0_6px_10px_rgb(0_0_0/0.35))]"
          />
        ))}
      </div>

      <FinalCta
        className="mt-24 md:mt-32 lg:mt-37.5"
        heading="Put your best coaching"
        dim="in every call."
        body="Book a free 20-minute call. We look at how your team works now and tell you the first thing worth building."
      >
        <Quote
          className="mt-11 text-left"
          caption="CEO, 70+ person team"
          portrait={{ ...PEOPLE.ceo, size: 52 }}
        >
          “We’re basically using AI to simulate [our Head of Coaching’s] brain.”
        </Quote>
      </FinalCta>

      <SiteFooter />
    </SheetSection>
  );
}
