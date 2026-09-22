-- Raw Firecrawl markdown from enrichment, kept so the ElevenLabs agent can
-- ground FAQ answers in it (passed as a dynamic variable), not just the
-- condensed structured summary in `enrichment`.
alter table public.lead_companies add column scraped_content text;
