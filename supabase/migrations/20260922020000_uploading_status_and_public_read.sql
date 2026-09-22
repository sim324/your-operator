-- Adds a distinct "uploading" progress step (logo fetch + color extraction),
-- and opens public SELECT on lead_companies so the intake dialog can watch
-- its own row live via Supabase Realtime with the publishable key. Row ids
-- are unguessable UUIDs and the data isn't sensitive; lead_contacts (emails)
-- stays fully locked down.

alter table public.lead_companies drop constraint lead_companies_status_check;
alter table public.lead_companies add constraint lead_companies_status_check
  check (status in ('pending', 'scraping', 'structuring', 'uploading', 'enriched', 'failed'));

create policy "Public read access to lead companies"
  on public.lead_companies for select
  using (true);
