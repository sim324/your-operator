import Image from "next/image";
import { Glow } from "@/components/site/glow";
import { ReviewVideo } from "@/components/site/review-video";
import { SectionEyebrow } from "@/components/site/section-eyebrow";
import { SectionLead } from "@/components/site/section-lead";
import { SectionHeading } from "@/components/site/section-heading";
import { SheetSection } from "@/components/site/sheet-section";
import { StarRating } from "@/components/site/star-rating";

const VIDEOS = [
  {
    video: "/assets/clients/christine.mp4",
    poster: "/assets/clients/christine-poster.jpg",
    label: "Christine, one of Sim’s coaching clients, on working with her",
    duration: "0:15",
    who: "Christine · coaching client",
    quote: "“Sim is honestly the best of the best.”",
  },
  {
    video: "/assets/clients/client-2.mp4",
    poster: "/assets/clients/client-2-poster.jpg",
    label: "One of Sim’s coaching clients on working with her",
    duration: "0:06",
    who: "Coaching client",
    quote: "“Working with Sim has been mind-blowing.”",
  },
];

// Screenshot sizes are the height each shows at 600px wide in the design.
const WALL = [
  [
    ["01", 191, "“I always have the most insightful conversations with Sim. She is extremely intelligent and so thoughtful in her responses.”"],
    ["02", 145, "“Sim within a very short time was able to identify some helpful themes about my relationship with my ex.”"],
    ["03", 237, "“Straightforward discussion to the point. Keen insight, uplifting session.”"],
    ["04", 124, "“I appreciated being challenged to grow.”"],
    ["05", 123, "“Sim is so full of guidance and wisdom.”"],
    ["06", 191, "“Coach Sim is amazing! She is so knowledgeable.”"],
  ],
  [
    ["07", 145, "“Sim is brilliant and insightful and very generous with her knowledge!”"],
    ["08", 175, "“Great! I appreciate the fresh perspectives that I haven’t thought about before. Telling me something I didn’t realize about myself.”"],
    ["09", 191, "“Sim, is absolutely amazing. So easy to connect with, wise, thought-provoking, and empowering.”"],
    ["10", 168, "“Always a pleasure talking to Sim. She is extremely intelligent and wise and is able to pick up on everything you are saying.”"],
    ["11", 123, "“Sim is very experienced and insightful, highly recommended!”"],
    ["12", 127, "“Sim is logical and caring and she gives me great advice.”"],
  ],
] as const;

export function ClientReviews() {
  return (
    <SheetSection
      variant="a"
      id="reviews"
      aria-label="Reviews from my coaching clients"
    >
      <div className="flex flex-col items-center text-center">
        <SectionEyebrow number="03">FROM MY COACHING CLIENTS</SectionEyebrow>
        <StarRating
          size={30}
          className="gap-1.5 [filter:drop-shadow(0_6px_16px_rgb(251_191_36/0.35))]"
        />
        <SectionHeading className="mt-[18px]">62+ five-star reviews.</SectionHeading>
        <SectionLead size="md" className="mt-5 max-w-[720px]">
          From my private coaching clients: two on video, and twelve more in
          their own words.
        </SectionLead>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-8 md:mt-14">
        {VIDEOS.map((v) => (
          <ReviewVideo key={v.video} {...v} />
        ))}
      </div>

      <div className="relative mt-16 md:mt-20">
        <Glow
          alpha={0.2}
          className="top-40 left-1/2 h-[860px] w-[min(1040px,100%)] -translate-x-1/2"
        />
        <div className="relative grid items-start gap-6 md:grid-cols-2 md:gap-x-8">
          {WALL.map((column, ci) => (
            <div
              key={ci}
              className={`flex flex-col gap-6 ${ci === 1 ? "md:mt-12" : ""}`}
            >
              {column.map(([id, h, alt]) => (
                <figure
                  key={id}
                  className="overflow-hidden rounded-xl bg-white shadow-[0_28px_50px_-24px_rgb(0_0_0/0.85),0_2px_6px_rgb(0_0_0/0.3)] transition-transform duration-[250ms] hover:-translate-y-1"
                >
                  <Image
                    src={`/assets/reviews/review-${id}.png`}
                    alt={`Five-star review: ${alt}`}
                    width={1200}
                    height={h * 2}
                    sizes="(min-width: 768px) 600px, 100vw"
                    className="block h-auto w-full"
                  />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-11 flex justify-center">
        <span className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-white/5 px-5 py-2 text-[15.5px] text-ink-3 ring-1 ring-white/10 ring-inset">
          <StarRating size={13} className="gap-0.5" />
          And 50 more five-star reviews like these
        </span>
      </div>
    </SheetSection>
  );
}
