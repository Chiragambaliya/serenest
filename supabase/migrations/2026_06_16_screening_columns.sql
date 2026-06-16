-- The screening_responses table was missing columns the API writes on every
-- submission (reason, conditions, format, frequency), so inserts failed and no
-- screening was ever saved. Add them (plus optional_screenings the admin reads).

alter table public.screening_responses
  add column if not exists reason              text,
  add column if not exists conditions          text[] default '{}',
  add column if not exists format              text,
  add column if not exists frequency           text,
  add column if not exists optional_screenings jsonb;

-- Legacy `responses` column was NOT NULL but the API never sets it, which
-- blocked every insert. Give it a default and allow nulls.
alter table public.screening_responses alter column responses set default '{}'::jsonb;
alter table public.screening_responses alter column responses drop not null;
