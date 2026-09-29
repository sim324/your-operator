"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { BookCallButton } from "./book-call-button";
import { Container } from "./container";
import { GlassPanel } from "./glass-panel";
import { LogoMark } from "./logo";
import { SmartLink } from "./smart-link";

function Brand() {
  return (
    <Link
      href="/"
      aria-label={`${SITE.name}, home`}
      className="flex items-center gap-2.5"
    >
      <LogoMark width={26} />
      <span className="font-display text-lg font-semibold tracking-[-0.01em]">
        {SITE.name}
      </span>
    </Link>
  );
}

/**
 * Floating pill nav, laid over the top of the first section. On small screens
 * the links and demo link move into a sheet, and the CTA stays in the bar.
 */
export function SiteHeader({ current }: { current?: "about" }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 z-40 transition-[top] duration-300",
        scrolled ? "top-2 md:top-3" : "top-3 md:top-6",
      )}
    >
      <Container>
        <GlassPanel
          className={cn(
            "flex h-14 items-center gap-4 rounded-full py-0 pr-2 pl-5 backdrop-blur-md transition-[height] duration-300 md:gap-[26px] md:pr-2.5 md:pl-[22px]",
            scrolled ? "md:h-14" : "md:h-16",
          )}
        >
          <Brand />

          <nav
            aria-label="Main"
            className="ml-auto hidden items-center gap-7 text-[15px] lg:flex"
          >
            {NAV_LINKS.map((link, i) => {
              const active = current === "about" && link.href === "/about";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative transition-colors hover:text-white",
                    active ? "text-white" : "text-ink-3",
                    scrolled && "animate-nav-drop",
                  )}
                  style={scrolled ? { animationDelay: `${i * 60}ms` } : undefined}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-[9px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-azure-400"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          <span
            aria-hidden="true"
            className="hidden h-[22px] w-px bg-white/16 lg:block"
          />
          <SmartLink
            href={SITE.demo}
            className="hidden text-[15px] font-medium text-ink-1 transition-colors hover:text-white lg:block"
          >
            Try the demo
          </SmartLink>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <BookCallButton
              size="cta"
              arrow={false}
              className="hidden sm:inline-flex"
            >
              {SITE.bookLabel}
            </BookCallButton>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                container={
                  open ? document.getElementById("marketing-root") : null
                }
                className="w-[min(88vw,360px)] gap-0 border-white/10 bg-surface p-6 pt-16"
              >
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation
                </SheetDescription>
                <nav aria-label="Mobile" className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="border-b border-white/8 py-4 font-display text-2xl font-semibold tracking-[-0.02em] text-ink"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <SmartLink
                    href={SITE.demo}
                    className="border-b border-white/8 py-4 font-display text-2xl font-semibold tracking-[-0.02em] text-ink"
                  >
                    Try the demo
                  </SmartLink>
                </nav>
                <BookCallButton size="cta-lg" className="mt-8 w-full" />
              </SheetContent>
            </Sheet>
          </div>
        </GlassPanel>
      </Container>
    </header>
  );
}
