import CtaButtonBook from "../site/cta-button-book";
import { ThemeButton } from "../ui/theme-button";

export default function WebHeader() {
  return (
    // Sticky: the header area stays transparent so the page shows around the
    // floating pill, and the pill gets a background so text doesn't run under it.
    <header className="sticky top-0 z-50 w-full flex py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-row items-center justify-between mx-auto max-w-7xl py-2 pl-6 pr-2 w-full border border-foreground dark:border-border rounded-full bg-background/80 backdrop-blur">
        <span className="text-xl tracking-normal font-medium">
          youroperator.ai
        </span>
        <div className="flex flex-row items-center gap-2">
          {/* <CtaButtonBook /> */}
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}
