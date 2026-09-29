import type { Metadata } from "next";
import { AboutClosing } from "@/components/blocks/about-closing";
import { AboutHero } from "@/components/blocks/about-hero";
import { AboutStats } from "@/components/blocks/about-stats";
import { AboutStory } from "@/components/blocks/about-story";
import { ClientReviews } from "@/components/blocks/client-reviews";
import { WhyItWorks } from "@/components/blocks/why-it-works";

const description =
  "Sim Sibanda coached for seven years, then built the AI system behind a 70+ person team’s 25% growth year. Meet the founder of Your Operator.";

export const metadata: Metadata = {
  title: "About Sim",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Sim · Your Operator",
    description,
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Sim · Your Operator",
    description,
  },
};

export default function AboutPage() {
  return (
    <main className="relative overflow-x-clip bg-canvas">
      <AboutHero />
      <AboutStats />
      <AboutStory />
      <WhyItWorks />
      <ClientReviews />
      <AboutClosing />
    </main>
  );
}
