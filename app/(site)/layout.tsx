import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat, Geist } from "next/font/google";
import { CalEmbed } from "@/components/site/cal-embed";
import { Grain } from "@/components/site/grain";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#070a12",
  colorScheme: "dark",
};

/**
 * The marketing site is dark-only and has its own fonts and brand colours.
 * `.marketing.dark` (see globals.css) scopes all of that to these pages, so
 * the product UI under /demo keeps its own theme. `#marketing-root` is where
 * portalled UI (the mobile menu) renders so it inherits the same scope.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="marketing-root"
      className={cn(
        "marketing dark relative flex min-h-screen flex-col bg-background text-foreground",
        geist.variable,
        bricolage.variable,
        caveat.variable,
      )}
    >
      {children}
      <CalEmbed />
      <Grain />
    </div>
  );
}
