-- Review themes for the leader page (see workflows/classify-reviews).
-- Claude reads a company's written reviews and proposes a small set of
-- themes specific to that business, then tags every review with the themes
-- it mentions (zero or more). Themes are topics, not sentiment: the star
-- rating already carries that. Not editable by users.

create table if not exists public.review_themes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.lead_companies (id) on delete cascade,

  -- Short snake_case handle Claude uses when tagging, unique per company.
  key text not null,
  name text not null,
  description text not null,

  -- Shared across all companies so different businesses stay comparable:
  -- a dentist's "Painless procedures" and a SaaS "Onboarding" both land in
  -- results_quality / people_service etc.
  category text not null check (category in (
    'people_service',
    'price_billing',
    'scheduling_access',
    'results_quality',
    'communication',
    'place_product',
    'other'
  )),

  position smallint not null default 0,
  created_at timestamptz not null default now(),

  unique (company_id, key)
);

create table if not exists public.review_theme_tags (
  review_id uuid not null references public.lead_reviews (id) on delete cascade,
  theme_id uuid not null references public.review_themes (id) on delete cascade,
  primary key (review_id, theme_id)
);

create index if not exists review_theme_tags_theme_id_idx
  on public.review_theme_tags (theme_id);

-- Server-only reads/writes with the secret key.
alter table public.review_themes enable row level security;
alter table public.review_theme_tags enable row level security;

-- Progress for the "Find themes" button, watched over Realtime.
alter table public.lead_companies add column review_themes_status text
  check (review_themes_status in ('discovering', 'tagging', 'ready', 'failed'));
alter table public.lead_companies add column review_themes_updated_at timestamptz;
