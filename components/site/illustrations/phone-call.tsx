import { LogoMark } from "@/components/site/logo";
import { FloorShadow, Stage } from "./stage";

const BARS = [8, 14, 20, 12, 22, 16, 9, 18, 12, 6];
const BUTTONS = [
  { side: "left-[-2px]", top: 84, h: 26 },
  { side: "left-[-2px]", top: 120, h: 42 },
  { side: "left-[-2px]", top: 170, h: 42 },
  { side: "right-[-2px]", top: 120, h: 58 },
];

/** A phone on a live call with Your Operator. */
export function PhoneCall() {
  return (
    <Stage
      label="A phone on a call with Your Operator"
      sceneWidth={351}
      shrink="max-[400px]:[zoom:0.9]"
    >
      <FloorShadow width={170} bottom={26} />
      <div className="absolute top-[26px] left-1/2 box-border h-[344px] w-[176px] -translate-x-1/2 rounded-[36px] bg-[linear-gradient(150deg,#4b5673_0%,#1d2336_36%,#0d111d_100%)] p-1.5 shadow-[0_34px_48px_-22px_rgb(0_0_0/0.85),inset_0_0_0_1px_rgb(255_255_255/0.14),inset_0_1px_1px_rgb(255_255_255/0.28)]">
        {BUTTONS.map((b) => (
          <span
            key={`${b.side}-${b.top}`}
            className={`absolute w-[3px] rounded-sm bg-[linear-gradient(90deg,#1a1f2e,#3a4258)] ${b.side}`}
            style={{ top: b.top, height: b.h }}
          />
        ))}
        <div className="relative flex h-full flex-col items-center overflow-hidden rounded-[30px] bg-[radial-gradient(200px_190px_at_50%_32%,rgb(59_130_246/0.22),rgb(59_130_246/0)_70%),linear-gradient(180deg,#0e1730_0%,#0a0f1f_100%)] text-center">
          <span
            aria-hidden="true"
            className="absolute top-[9px] left-1/2 h-3.5 w-[54px] -translate-x-1/2 rounded-[7px] bg-[#04060c]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgb(255_255_255/0.09)_0%,rgb(255_255_255/0.02)_34%,rgb(255_255_255/0)_35%)]"
          />
          <span className="mt-[50px] text-[10.5px] tracking-[0.06em] text-ink-5">
            30-MINUTE CALL
          </span>
          <span className="mt-3.5 flex size-[58px] items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_35%,#1e3a8a,#0b1020)] shadow-[0_0_0_1px_rgb(147_197_253/0.35),0_0_26px_rgb(96_165_250/0.45)]">
            <LogoMark width={28} className="drop-shadow-none" />
          </span>
          <span className="mt-3 font-display text-[15px] font-semibold text-ink">
            Your Operator
          </span>
          <span className="mt-[3px] text-[11.5px] text-ink-3 tabular-nums">
            12:48
          </span>
          <span className="mt-4 flex items-center gap-[3px]" aria-hidden="true">
            {BARS.map((h, i) => (
              <span
                key={i}
                className="w-[3px] rounded-sm bg-azure-300"
                style={{ height: h }}
              />
            ))}
          </span>
          <span className="mt-auto mb-8 flex size-10 items-center justify-center rounded-full bg-danger shadow-[0_6px_14px_-4px_rgb(229_72_77/0.7)]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 15.5c5.4-4.7 12.6-4.7 18 0l-2.4 2.6-3.3-1.4v-2.6a11 11 0 0 0-6.6 0v2.6L5.4 18.1Z" />
            </svg>
          </span>
        </div>
      </div>
    </Stage>
  );
}
