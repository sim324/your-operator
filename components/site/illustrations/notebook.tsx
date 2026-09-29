import { cn } from "@/lib/utils";
import { FloorShadow, Stage } from "./stage";

const INK = "#16121C";
const BLUE = "#0F63E8";

type Part = { text: string; color: string };
type Row = { parts: Part[]; head?: boolean; highlight?: boolean };

const METHOD: Row[] = [
  { head: true, parts: [{ text: "Our method", color: INK }] },
  ...[
    "Their problem",
    "What it costs them",
    "Put a number on it",
    "Show how it runs",
    "Offer a small pilot",
  ].map<Row>((text, i) => ({
    highlight: i === 2,
    parts: [
      { text: `${i + 1}.`, color: BLUE },
      { text: text, color: INK },
    ],
  })),
];

const NOTES: Row[] = [
  { head: true, parts: [{ text: "Dee’s notes", color: "#7A2FF0" }] },
  { parts: [{ text: "“What did that cost you?”", color: BLUE }] },
  { parts: [{ text: "“What’s that across", color: BLUE }] },
  { parts: [{ text: "a quarter?”", color: BLUE }] },
  { parts: [{ text: "Let them say the number.", color: INK }] },
  { parts: [{ text: "Pause after the price.", color: "#E8177D" }] },
];

function Page({
  side,
  rows,
}: {
  side: "left" | "right";
  rows: Row[];
}) {
  const left = side === "left";
  return (
    <div
      className={cn(
        "absolute top-3 h-[272px] w-[188px]",
        left
          ? "left-4 rounded-l-[3px] bg-[linear-gradient(90deg,#f3eddf_0%,#f7f2e7_62%,#ede5d4_90%,#ddd3bf_100%)] shadow-[-1px_0_0_#d8cfbb,-2px_0_0_#f2ecdd,-3px_0_0_#d2c8b2,-4px_0_0_#efe8d8,-5px_0_0_#ccc1aa]"
          : "left-[204px] rounded-r-[3px] bg-[linear-gradient(90deg,#ddd3bf_0%,#ede5d4_10%,#f7f2e7_38%,#f3eddf_100%)] shadow-[1px_0_0_#d8cfbb,2px_0_0_#f2ecdd,3px_0_0_#d2c8b2,4px_0_0_#efe8d8,5px_0_0_#ccc1aa]",
      )}
    >
      <div className="absolute top-[18px] left-4 h-[234px] w-[164px] bg-[repeating-linear-gradient(180deg,rgb(0_0_0/0)_0px,rgb(0_0_0/0)_25px,rgb(58_78_140/0.17)_25px,rgb(58_78_140/0.17)_26px)]">
        {rows.map((row, i) => (
          <div
            key={i}
            className="box-border flex h-[26px] items-end pb-[5px] whitespace-nowrap"
            style={
              row.highlight
                ? {
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 38%, rgba(253,224,71,0.55) 38%, rgba(253,224,71,0.55) 86%, rgba(0,0,0,0) 86%) 0 0 / 132px 100% no-repeat",
                  }
                : undefined
            }
          >
            {row.parts.map((p, j) => (
              <span
                key={j}
                className="font-hand leading-none font-bold"
                style={{
                  color: p.color,
                  fontSize: row.head ? 20 : 17,
                  marginRight: j < row.parts.length - 1 ? "0.3em" : 0,
                }}
              >
                {p.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** An open notebook: our method on the left, a rep's notes on the right. */
export function Notebook() {
  return (
    <Stage
      label="An open notebook: our method on the left, notes on the right"
      sceneWidth={474}
      shrink="min-[481px]:max-sm:[zoom:0.85] max-[480px]:[zoom:0.7]"
    >
      <FloorShadow width={380} bottom={30} />
      <div className="absolute top-10 left-1/2 h-[296px] w-[408px] -translate-x-1/2 rounded-[14px] bg-[linear-gradient(160deg,#2c3766_0%,#1d264b_55%,#161d3c_100%)] shadow-[0_36px_50px_-24px_rgb(0_0_0/0.85),inset_0_0_0_1px_rgb(255_255_255/0.07),inset_0_1px_0_rgb(255_255_255/0.12)]">
        <span
          aria-hidden="true"
          className="absolute inset-1.5 rounded-[10px] border border-dashed border-[rgb(226_176_128/0.42)]"
        />
        <Page side="left" rows={METHOD} />
        <Page side="right" rows={NOTES} />
        <span
          aria-hidden="true"
          className="absolute top-3 left-[190px] h-[272px] w-7 bg-[linear-gradient(90deg,rgb(90_70_40/0)_0%,rgb(90_70_40/0.16)_42%,rgb(60_45_25/0.3)_50%,rgb(90_70_40/0.16)_58%,rgb(90_70_40/0)_100%)]"
        />
        <span
          aria-hidden="true"
          className="absolute top-1 left-[199px] h-[326px] w-2.5 bg-[linear-gradient(90deg,#18203f,#2e3b74_50%,#18203f)] [clip-path:polygon(0_0,100%_0,100%_100%,50%_93%,0_100%)] drop-shadow-[0_2px_2px_rgb(0_0_0/0.35)]"
        />
      </div>
    </Stage>
  );
}
