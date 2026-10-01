import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { CalEmbed } from "@/components/site/cal-embed";
import { Grain } from "@/components/site/grain";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const geist = localFont({
  src: "../fonts/geist-wght.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

// Variable font with the optical-size axis, so big headlines get the tighter display cut.
const bricolage = localFont({
  src: "../fonts/bricolage-grotesque-opsz-wght.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});

const caveat = localFont({
  src: "../fonts/caveat-wght.woff2",
  variable: "--font-caveat",
  weight: "400 700",
  display: "swap",
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
