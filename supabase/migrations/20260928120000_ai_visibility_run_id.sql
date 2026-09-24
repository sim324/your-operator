-- The workflow run behind the current AI visibility check, so the page's
-- Cancel button can stop it. Set when a check starts; cleared on cancel.
alter table public.lead_companies add column ai_visibility_run_id text;
