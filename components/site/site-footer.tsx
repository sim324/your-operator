import { FOOTER_LINKS, SITE } from "@/lib/site";
import { LogoMark } from "./logo";
import { SmartLink } from "./smart-link";

const linkClass = "transition-colors hover:text-white";

export function SiteFooter() {
  return (
    <footer className="mt-24 flex flex-col gap-6 border-t border-white/10 pt-7 md:mt-32 lg:mt-[150px] lg:flex-row lg:items-center lg:gap-3">
      <div className="flex items-center gap-3">
        <LogoMark width={24} />
        <span className="font-display text-base font-semibold tracking-[-0.01em]">
          {SITE.name}
        </span>
      </div>
      <nav
        aria-label="Footer"
        className="flex flex-wrap gap-x-6 gap-y-3 text-[15px] text-ink-5 lg:ml-10"
      >
        {FOOTER_LINKS.map((link) => (
          <SmartLink key={link.label} href={link.href} className={linkClass}>
            {link.label}
          </SmartLink>
        ))}
      </nav>
      <a
        href={SITE.mailto}
        className={`${linkClass} text-[15px] text-ink-3 lg:ml-auto`}
      >
        {SITE.email}
      </a>
      <span className="text-[15px] text-ink-dim">© 2026 {SITE.name}</span>
    </footer>
  );
}
