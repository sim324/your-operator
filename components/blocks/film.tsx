import { FilmPlayer } from "@/components/site/film-player";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionLead } from "@/components/site/section-lead";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";

export function Film() {
  return (
    <SheetSection
      variant="a"
      id="film"
      aria-label="How Your Operator works, the film"
    >
      <div className="flex flex-col items-center text-center">
        <SectionEyebrow number="03">THE 2-MINUTE FILM</SectionEyebrow>
        <SectionHeading dim="live on the call.">
          Paige shows your team the next line,
        </SectionHeading>
        <SectionLead>
          Only the person on the call sees it. Here is how it works, in two
          minutes.
        </SectionLead>
      </div>
      <FilmPlayer
        className="mt-10 md:mt-14"
        loopSrc="/assets/video/film-loop.mp4"
        loopPoster="/assets/video/film-loop-poster.jpg"
        loopLabel="From the film: on the call, Paige shows the rep what to say next, and only the rep can see it"
        filmSrc="/assets/video/film-full-web.mp4"
        filmPoster="/assets/video/film-full-poster.jpg"
        filmLabel="How Your Operator works, a two-minute film with Paige"
        aspect="aspect-[1212/682]"
        openText="Watch the full film"
        openAria="Watch the whole two-minute film, with sound"
        glowClassName="top-8 h-[80%]"
      />
    </SheetSection>
  );
}
