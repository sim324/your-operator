-- Google place lookup for the leader page's reviews section (see
-- workflows/find-google-place). Started by a button on the leader page, never
-- by the intake dialog.
--
-- Only the place id and Maps URL are stored. Google's Places terms allow
-- keeping a place_id indefinitely but not the Places content itself
-- (rating, reviews), so those are fetched fresh by place_id at render time.
-- The Maps URL is also what the Apify reviews actor will take later.

alter table public.lead_companies add column google_maps_url text;
alter table public.lead_companies add column google_place_id text;

-- Null until someone clicks "Find Google reviews".
alter table public.lead_companies add column google_place_status text
  check (google_place_status in ('searching', 'found', 'not_found', 'failed'));
