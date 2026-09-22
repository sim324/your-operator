-- Widen lead_companies.status to carry workflow progress (see
-- workflows/enrich-company) instead of just pending/enriched/failed, and add
-- a public bucket for re-hosted company logos.

alter table public.lead_companies drop constraint lead_companies_status_check;
alter table public.lead_companies add constraint lead_companies_status_check
  check (status in ('pending', 'scraping', 'structuring', 'enriched', 'failed'));

insert into storage.buckets (id, name, public)
values ('lead-logos', 'lead-logos', true)
on conflict (id) do nothing;

create policy "Public read access to lead logos"
  on storage.objects for select
  using (bucket_id = 'lead-logos');
