import { FinalCta } from "@/components/site/final-cta";
import { SheetSection } from "@/components/site/sheet-section";
import { SiteFooter } from "@/components/site/site-footer";

export function AboutClosing() {
  return (
    <SheetSection
      variant="b"
      id="book"
      aria-label="Book a free 20-minute call"
      tightBottom
    >
      <FinalCta
        heading="Let’s talk about"
        dim="your team."
        body="Book a free 20-minute call. I’ll look at how your team works today and tell you the first thing worth building."
      />
      <SiteFooter />
    </SheetSection>
  );
}
