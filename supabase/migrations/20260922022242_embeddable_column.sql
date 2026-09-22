-- Whether the company's site allows being iframed (checked via
-- X-Frame-Options / CSP frame-ancestors headers during enrichment). Null
-- until checked or when there's no domain to check.
alter table public.lead_companies add column embeddable boolean;
