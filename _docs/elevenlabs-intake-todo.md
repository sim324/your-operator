# ElevenLabs intake + prospects widget — build todo

Working doc for scoping `_docs/elevenlabs-how-to.md` into buildable chunks before we
write code. Nothing here is implemented yet.

## What already exists

- `components/demo/shared/email-gate-dialog.tsx` is the "first dialog after Try now"
  the spec describes. Today it's email-only + a video placeholder. This is where the
  company field / lookup step gets added.
- `app/demo/prospect/page.tsx` is a stub — this is where the branded floating
  action button / simulated widget will live.
- No Supabase, ElevenLabs, Firecrawl, or Clay code anywhere in the repo yet. Fully
  greenfield.
- `.env.local` already has real keys for all four: `CLAY_API_KEY`,
  `FIRECRAWL_API_KEY`, `ELEVENLABS_AGENT_ID`, `ELEVENLABS_API_KEY`,
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
  `SUPABASE_DB_PASSWORD`, `SUPABASE_SECRET_KEY`. So this can be stubbed against
  real clients rather than fully mocked — we just need to confirm which flows are
  ready to hit live vs. which should no-op/log until we say go.
- `workflow` (Vercel Workflow SDK) is already installed and has a manifest under
  `app/.well-known/workflow/`. Worth considering for the scrape → enrich → store
  pipeline (durable steps, retries, suspend/resume) instead of a plain async
  function, since that pipeline has multiple external calls that can fail
  independently (Firecrawl, Clay, Supabase storage upload).

## ElevenLabs: two touchpoints, two different products (researched)

The spec's two ElevenLabs moments are **not** the same underlying component:

1. **Intake dialog chat** (inside our own `Dialog`, matches app design) →
   `@elevenlabs/react` headless SDK (`useConversation` + `ConversationProvider`).
   No pre-built UI; we build the chat surface ourselves. Supports `overrides`
   (prompt/first message/language) and `sendContextualUpdate()` for feeding it
   company context as we learn it.
2. **Prospects-page floating action button** (simulating the widget on the
   *company's own site*, branded in their colors) → the pre-built
   `<elevenlabs-convai>` embed (`@elevenlabs/convai-widget-embed`). This is
   literally a drop-in floating widget with `avatar-orb-color-1/2`,
   `avatar-image-url`, `variant="expanded"`, `dismissible`, and per-embed
   `dynamic-variables` / `override-*` attributes — a much closer match to "what
   would this look like embedded on their site" than hand-building one.

**Where they overlap:** both are driven by the same Agents Platform agent
(`ELEVENLABS_AGENT_ID`) and the same context-seeding contract (dynamic
variables / prompt overrides). So we can seed both from one
`buildAgentContext(company)` function even though the UI layer is genuinely
different components. Recommend building them separately, sharing only that
context-shaping function — not a single "shared widget component."

Open question: does the intake-dialog agent need a different agent (config)
than the reception-widget agent, or one agent whose behavior is steered
entirely by overrides/dynamic variables per surface? Leaning one agent, two
override profiles, but flagging since only one `ELEVENLABS_AGENT_ID` exists in
`.env.local` right now.

## Data model (decided): two tables, not one

Rationale: multiple contacts can come from the same company — don't re-scrape
per person.

- **`lead_companies`** — one row per company. Keyed by domain when we have one.
  Holds: `domain` (nullable, unique when present), `name`, `description`
  (secondary "what do you do?" answer when no domain), `logo_url`,
  `brand_color`, `enrichment` (jsonb — Clay output: business type,
  products/services, who they sell to, about), `source` (`"firecrawl"` |
  `"clay"` | `"manual"` | `"sample"`), `status` (`pending` | `enriched` |
  `failed`), timestamps.
- **`lead_contacts`** — one row per person. Holds: `email`, `name` (nullable,
  Clay person lookup), `company_id` (FK → `lead_companies`), timestamps.

Matching rule: normalize + look up existing `lead_companies` row by domain
before creating a new one; contacts always insert fresh.

## Intake form flow (decided shape)

1. Primary field: **company domain/URL** (e.g. `acme.com`). This is what feeds
   Firecrawl + gets iframed later on the prospects page.
2. Link/fallback: **"Don't have a website?"** → reveals two secondary fields:
   - Company name (required)
   - "What do you do?" free-text (required) — gives Clay/enrichment something
     to work with when there's no page to scrape.
   - Stretch: also accept a LinkedIn company URL as an alternate enrichment
     source when there's no website.
3. Email field stays as-is (already validated).
4. **"Use sample data" option** alongside the no-website path, for demo-ability
   when someone doesn't want to type real company info — seeds a canned
   `lead_companies` row (fake logo/brand color/enrichment) so the rest of the
   demo (prospects iframe, branded widget) still has something to render.

## Open questions to resolve before/while building

- [ ] Scope for first pass — which of the buildable chunks below do we actually
      build now vs. later? (Not decided yet — revisit once this doc is reviewed.)
- [ ] One ElevenLabs agent with per-surface overrides, or two agents?
- [ ] Is Clay used for company enrichment only, or also for the person/name
      lookup from email mentioned in the spec? (Doc says "maybe" for both.)
- [ ] Brand color: extracted from the scraped logo (e.g. dominant color via
      Firecrawl'd image), or a separate Clay/CSS scrape of the site's actual
      brand color? Doc only says "primary brand color," source unspecified.
- [ ] Where does Firecrawl run — a server action, a route handler, or a
      `workflow` step? Leaning `workflow` step given multi-service pipeline.
- [ ] Supabase Storage bucket for logos — new bucket name/policy needed.
- [ ] What happens on failure (Firecrawl/Clay error, no logo found) — fall back
      to sample data automatically, or show a manual retry?

## Buildable chunks (for when we pick scope)

1. Supabase schema: `lead_companies` + `lead_contacts` migration + typed client.
2. Intake dialog: add domain field + no-website fallback fields + sample-data
   option to `email-gate-dialog.tsx`; on submit, upsert contact + company
   (enrichment happens async/after).
3. Enrichment pipeline: Firecrawl scrape (logo, brand color, about) + Clay
   company enrichment, as a `workflow` flow with steps; writes back to
   `lead_companies`.
4. Prospects page: iframe of the company's URL (or sample screenshot when no
   URL) + floating `<elevenlabs-convai>` widget themed with the stored
   `brand_color`/logo, seeded with company context via dynamic variables.
5. Intake-dialog agent chat: `@elevenlabs/react` `useConversation` surface
   inside the dialog, seeded with whatever company context is known so far.
