-- Prospect intake: company + contact records collected from the "Try now"
-- email-gate dialog and enriched via Firecrawl/Clay.
-- See _docs/elevenlabs-intake-todo.md for the shape this was designed against.

create table if not exists public.lead_companies (
  id uuid primary key default gen_random_uuid(),

  -- Normalized registrable domain (e.g. "acme.com"), unique when known.
  -- Null when the contact had no website and used the name/description
  -- fallback instead.
  domain text unique,

  name text,
  description text, -- "what do you do?" fallback answer when there's no domain to scrape

  logo_url text,
  brand_color text, -- e.g. "#4F46E5"

  -- Firecrawl/Clay findings: business type, products/services, who they
  -- sell to, about, etc. Shape intentionally loose at this stage.
  enrichment jsonb not null default '{}'::jsonb,

  source text not null default 'manual'
    check (source in ('firecrawl', 'clay', 'manual', 'sample')),
  status text not null default 'pending'
    check (status in ('pending', 'enriched', 'failed')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint lead_companies_domain_or_name check (domain is not null or name is not null)
);

create table if not exists public.lead_contacts (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text, -- optional Clay person-lookup result
  company_id uuid references public.lead_companies (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists lead_contacts_company_id_idx on public.lead_contacts (company_id);

-- RLS on with no policies yet: writes happen server-side with the Supabase
-- secret key (bypasses RLS), so nothing here is publicly readable/writable
-- until we deliberately add a policy.
alter table public.lead_companies enable row level security;
alter table public.lead_contacts enable row level security;
