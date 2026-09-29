import type { Metadata } from "next";
import { Closing } from "@/components/blocks/closing";
import { Film } from "@/components/blocks/film";
import { Founder } from "@/components/blocks/founder";
import { Hero } from "@/components/blocks/hero";
import { HowItWorks } from "@/components/blocks/how-it-works";
import { Platform } from "@/components/blocks/platform";
import { Problem } from "@/components/blocks/problem";
import { ProofStats } from "@/components/blocks/proof-stats";
import { Results } from "@/components/blocks/results";
import { YoursToKeep } from "@/components/blocks/yours-to-keep";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="relative overflow-x-clip bg-canvas">
      <Hero />
      <ProofStats />
      <Problem />
      <Founder />
      <Film />
      <HowItWorks />
      <Results />
      <Platform />
      <YoursToKeep />
      <Closing />
    </main>
  );
}
