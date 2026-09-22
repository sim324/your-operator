import CtaButtonBook from "../site/cta-button-book";
import { ThemeButton } from "../ui/theme-button";

export default function WebHeader() {
  return (
    <header className="w-full flex py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-row items-center justify-between mx-auto max-w-7xl py-2 pl-6 pr-2 w-full border border-foreground dark:border-border rounded-full">
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
