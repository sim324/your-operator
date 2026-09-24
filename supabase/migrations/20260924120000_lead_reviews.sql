-- Full Google review history for the leader page's metrics card and monthly
-- volume chart, pulled by the Apify Google Maps reviews actor (see
-- workflows/fetch-google-reviews). Unlike Places API content, scraped reviews
-- can be stored.

create table if not exists public.lead_reviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.lead_companies (id) on delete cascade,

  source text not null default 'google' check (source in ('google')),
  -- The source's own id for the review; with company_id, the upsert key so
  -- a re-pull updates rows instead of duplicating them.
  external_id text not null,

  rating smallint check (rating between 1 and 5),
  body text,
  published_at timestamptz,
  review_url text,
  owner_response text,
  owner_responded_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (company_id, source, external_id)
);

create index if not exists lead_reviews_company_published_idx
  on public.lead_reviews (company_id, published_at);

-- Server-only reads/writes with the secret key, like lead_contacts.
alter table public.lead_reviews enable row level security;

-- Progress for the "Pull review history" button, watched over Realtime like
-- google_place_status. Null until the button is clicked.
alter table public.lead_companies add column google_reviews_status text
  check (google_reviews_status in ('fetching', 'ready', 'failed'));
alter table public.lead_companies add column google_reviews_fetched_at timestamptz;
