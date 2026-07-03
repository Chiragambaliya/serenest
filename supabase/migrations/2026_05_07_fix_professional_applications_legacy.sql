-- ============================================================
-- 2026-05-07 — Fix legacy professional_applications schema.
--
-- Production had an older table shape (designation-focused) while
-- the current onboarding API writes role/registration/fee fields.
-- This mismatch caused POST /api/professionals/apply to return 500.
--
-- This migration is idempotent and safe to re-run.
-- ============================================================

alter table public.professional_applications
  add column if not exists role          text,
  add column if not exists role_label    text,
  add column if not exists registration  text,
  add column if not exists year          text,
  add column if not exists council       text,
  add column if not exists clinic        text,
  add column if not exists city          text,
  add column if not exists languages     text,
  add column if not exists specialities  text,
  add column if not exists fee_inr       numeric,
  add column if not exists duration_min  integer,
  add column if not exists modes         text,
  add column if not exists availability  text;

-- Onboarding allows optional email and does not require designation.
alter table public.professional_applications alter column email drop not null;

-- The rest only applies to the legacy production shape (designation-focused
-- columns). Fresh databases created from schema.sql never had them — skip.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'professional_applications'
      and column_name = 'designation'
  ) then
    alter table public.professional_applications alter column designation drop not null;

    -- Backfill new fields from older columns when possible.
    update public.professional_applications
    set
      role         = coalesce(role, lower(designation)),
      role_label   = coalesce(role_label, designation),
      registration = coalesce(registration, medical_council_number),
      clinic       = coalesce(clinic, clinic_name),
      languages    = coalesce(languages, array_to_string(languages_spoken, ', ')),
      specialities = coalesce(specialities, array_to_string(areas_of_focus, ', ')),
      fee_inr      = coalesce(fee_inr, consultation_fee),
      duration_min = coalesce(duration_min, 45),
      modes        = coalesce(
        modes,
        trim(both ' /' from concat(
          case when available_online then 'Video / Chat' else '' end,
          case when available_in_person then ' / In-person' else '' end
        ))
      ),
      availability = coalesce(availability, 'Mon-Sat')
    where true;
  end if;
end $$;
