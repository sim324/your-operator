-- AI visibility (see workflows/check-ai-visibility): does Claude, searching
-- the web without being told about the business, recommend it for the
-- unbranded searches a customer would make? Claude writes 5 such queries per
-- company, each is answered 3 times, and each answer is parsed into the
-- ranked businesses it recommended and the sources it cited.

create table if not exists public.ai_visibility_queries (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.lead_companies (id) on delete cascade,
  query text not null,
  intent text not null check (intent in (
    'service_location', -- "dental implants in Denver"
    'best_near_me',     -- "best cosmetic dentist near me"
    'problem',          -- "chipped tooth, can I be seen today"
    'comparison'        -- "affordable Invisalign with payment plans"
  )),
  position smallint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists ai_visibility_queries_company_idx
  on public.ai_visibility_queries (company_id);

-- One row per run of a query. Answers vary run to run, which is why each
-- query is asked more than once.
create table if not exists public.ai_visibility_answers (
  id uuid primary key default gen_random_uuid(),
  query_id uuid not null references public.ai_visibility_queries (id) on delete cascade,
  company_id uuid not null references public.lead_companies (id) on delete cascade,
  attempt smallint not null,

  -- The model that actually answered (a refusal fallback can change it).
  model text,
  answer text,
  -- [{url, title}] web sources the answer cited
  citations jsonb not null default '[]'::jsonb,

  -- Filled by the extraction pass. Null until parsed.
  -- [{name, website}] in the order the answer recommended them
  businesses jsonb,
  mentioned boolean,
  -- 1-based position among recommended businesses; null when not mentioned
  rank smallint,

  created_at timestamptz not null default now(),
  unique (query_id, attempt)
);

create index if not exists ai_visibility_answers_company_idx
  on public.ai_visibility_answers (company_id);

-- Server-only reads/writes with the secret key.
alter table public.ai_visibility_queries enable row level security;
alter table public.ai_visibility_answers enable row level security;

-- Progress for the "Check AI visibility" button, watched over Realtime.
alter table public.lead_companies add column ai_visibility_status text
  check (ai_visibility_status in ('generating', 'checking', 'ready', 'failed'));
alter table public.lead_companies add column ai_visibility_updated_at timestamptz;
-- Where the business serves, as the web search tool's approximate user
-- location, so "near me" searches resolve locally:
-- {city, region, country, timezone}
alter table public.lead_companies add column ai_visibility_location jsonb;
