-- Optional disease-specific self-screening payloads (ISI, AUDIT-C, SCOFF, trauma screen)
alter table public.screening_responses
  add column if not exists optional_screenings jsonb;

comment on column public.screening_responses.optional_screenings is
  'JSON payload for optional tools: isi, audit_c, scoff, ptsd_screen';
