import Image from "next/image";
import { GlassPanel } from "@/components/site/glass-panel";
import { FloorShadow, Stage } from "./stage";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const LINES = [96, 138, 180, 222, 264];
// September 2026 starts on a Tuesday, so day 1 sits in the second column.
const DAYS = Array.from({ length: 30 }, (_, i) => {
  const cell = i + 1;
  return { day: i + 1, left: 13 + 30 * (cell % 7), top: 104 + 42 * Math.floor(cell / 7) };
});

/** A wall calendar with a call on the 28th, and Paige offering rehearsal time. */
export function WallCalendar() {
  return (
    <Stage
      label="A wall calendar with a call booked on the 28th, and Paige suggesting time to rehearse"
      sceneWidth={338}
    >
      <FloorShadow width={210} bottom={28} />
      <div className="absolute top-[42px] h-[316px] w-[236px]" style={{ left: 30 }}>
        <span
          aria-hidden="true"
          className="absolute -top-5 left-1/2 box-border size-4 -translate-x-1/2 rounded-full border-2 border-[#8e97ac]"
        />
        <div className="absolute inset-0 overflow-hidden rounded-md bg-[linear-gradient(180deg,#f7f2e8_0%,#efe8da_100%)] shadow-[0_34px_46px_-22px_rgb(0_0_0/0.85),inset_0_0_0_1px_rgb(0_0_0/0.05)]">
          <div className="flex h-[70px] flex-col items-center justify-center gap-1 bg-linear-to-b from-[#25336b] to-[#1b2654]">
            <span className="mr-[-0.22em] font-display text-[17px] font-bold tracking-[0.22em] text-ink">
              SEPTEMBER
            </span>
            <span className="mr-[-0.2em] text-[10px] tracking-[0.2em] text-ink-4">
              2026
            </span>
          </div>
          <div className="absolute top-20 left-[13px] flex text-[9px] font-semibold tracking-[0.06em] text-[#7a8196]">
            {WEEKDAYS.map((d, i) => (
              <span key={i} className="w-[30px] text-center">
                {d}
              </span>
            ))}
          </div>
          {LINES.map((top) => (
            <span
              key={top}
              className="absolute left-[13px] h-px w-[210px] bg-[rgb(40_52_90/0.1)]"
              style={{ top }}
            />
          ))}
          {DAYS.map(({ day, left, top }) => (
            <span
              key={day}
              className={
                day === 28
                  ? "absolute w-[30px] text-center text-[10.5px] font-bold text-[#1d4ed8] tabular-nums"
                  : "absolute w-[30px] text-center text-[10.5px] font-medium text-[#3a3f4e] tabular-nums"
              }
              style={{ left, top }}
            >
              {day}
            </span>
          ))}
          <span className="absolute top-[268px] left-[17px] box-border size-[22px] rounded-full border-2 border-[#2563eb]" />
          <span className="absolute top-[294px] left-[13px] w-[70px] font-hand text-[15px] font-bold whitespace-nowrap text-[#0f63e8]">
            Dana, 2 pm
          </span>
        </div>
        <span
          aria-hidden="true"
          className="absolute inset-x-3.5 -top-1.5 h-[13px] rounded-[3px] bg-[repeating-linear-gradient(90deg,rgb(0_0_0/0)_0px,rgb(0_0_0/0)_6px,#c5ccda_6px,#c5ccda_9px,rgb(0_0_0/0)_9px,rgb(0_0_0/0)_13px)]"
        />
      </div>

      <GlassPanel
        variant="frame"
        className="absolute top-[236px] left-32 box-border w-[210px] rounded-[18px] p-3.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),inset_0_0_0_1px_rgb(255_255_255/0.09),0_26px_50px_-18px_rgb(0_0_0/0.85)]"
      >
        <div className="flex items-center gap-[9px]">
          <Image
            src="/assets/people/paige.jpg"
            alt=""
            width={60}
            height={60}
            className="size-[30px] shrink-0 rounded-full object-cover shadow-[0_0_0_2px_rgb(255_255_255/0.85),0_6px_14px_-4px_rgb(0_0_0/0.6)]"
          />
          <span className="flex flex-col">
            <span className="text-[13px] font-semibold">Paige suggests</span>
            <span className="text-[11px] text-ink-4">Before your 2 pm</span>
          </span>
        </div>
        <p className="mt-2.5 text-[13.5px] leading-[19px] font-medium text-ink-1">
          Block 20 minutes before Dana to rehearse.
        </p>
        <div className="mt-3 flex gap-1.5">
          <span className="inline-flex h-7 items-center rounded-full bg-ink-1 px-3 text-[12.5px] font-semibold text-surface">
            Accept
          </span>
          <span className="inline-flex h-7 items-center rounded-full bg-white/[0.045] px-3 text-[12.5px] font-medium text-ink-1 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07)]">
            Not now
          </span>
        </div>
      </GlassPanel>
    </Stage>
  );
}
