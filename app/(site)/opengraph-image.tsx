import { OG_SIZE, ogCard } from "@/lib/og-card";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return ogCard({
    headline: "Your best coaching,",
    dim: "in every call.",
    sub: "An AI system built around how your best people already sell.",
  });
}
