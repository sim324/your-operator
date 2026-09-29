import { OG_SIZE, ogCard } from "@/lib/og-card";

export const alt = "Sim Sibanda, founder of Your Operator";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return ogCard({
    headline: "I spent seven years on the calls.",
    dim: "Now I build the AI behind them.",
    sub: "Sim Sibanda, founder of Your Operator",
    fontSize: 62,
  });
}
