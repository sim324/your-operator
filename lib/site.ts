const EMAIL = "sim@youroperator.ai";

export const SITE = {
  name: "Your Operator",
  url: "https://www.youroperator.ai",
  tagline: "Your best coaching, in every call.",
  description:
    "We build an AI system around how your best people already sell, so the rest of your team sells that way too. It starts in your first month.",
  email: EMAIL,
  mailto: `mailto:${EMAIL}`,
  /** Cal.com booking popup, opened by any element carrying these data attributes. */
  cal: {
    namespace: "connect",
    link: "your-operator-sim/30min",
    config: JSON.stringify({
      layout: "month_view",
      useSlotsViewOnSmallScreen: "true",
      theme: "dark",
    }),
    /** Popup look. The site is dark-only, so the popup follows it. */
    ui: {
      theme: "dark",
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: {
        light: {
          "cal-brand": "#2f6bff",
          "cal-brand-emphasis": "#1f55e0",
          "cal-brand-text": "#ffffff",
        },
        dark: {
          "cal-brand": "#2f6bff",
          "cal-brand-emphasis": "#4580ff",
          "cal-brand-text": "#ffffff",
          "cal-bg": "#0b1020",
          "cal-bg-subtle": "#0f172a",
          "cal-bg-muted": "#141e35",
          "cal-bg-emphasis": "#1b2744",
          "cal-border": "#232d4a",
          "cal-border-emphasis": "#33406a",
          "cal-text": "#c9d2e3",
          "cal-text-emphasis": "#f7f8fb",
          "cal-text-subtle": "#a9b4cc",
          "cal-text-muted": "#8e99b2",
        },
      },
    },
  },
  demo: "https://www.simbuilds.co/d/halden",
  bookLabel: "Book a 30-minute call",
  trust: [
    "30-minute call",
    "Custom-built. The IP is yours.",
    "Your team keeps its own voice",
  ],
} as const;

export const NAV_LINKS = [
  { label: "How it works", href: "/#how" },
  { label: "Results", href: "/#results" },
  { label: "The platform", href: "/#platform" },
  { label: "About", href: "/about" },
] as const;

export const FOOTER_LINKS = [
  { label: "How it works", href: "/#how" },
  { label: "Case studies", href: "/#results" },
  { label: "The platform", href: "/#platform" },
  { label: "About", href: "/about" },
  { label: "Try the demo", href: SITE.demo },
  { label: "Contact", href: SITE.mailto },
] as const;
