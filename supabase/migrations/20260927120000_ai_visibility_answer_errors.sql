-- An answer that still fails after its retry is recorded instead of failing
-- the whole check: `error` holds why, `answer` stays null, and the results
-- page leaves it out of the score.
alter table public.ai_visibility_answers add column error text;
