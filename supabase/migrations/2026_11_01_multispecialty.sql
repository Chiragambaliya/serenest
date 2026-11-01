-- ============================================================
-- 2026-11-01 — Multispecialty Serenest
--
-- Serenest now offers consultations across medical specialties, not only
-- mental health. This migration:
--   1. adds `specialty` to appointments and professional_applications
--      (slugs from src/lib/specialties.js; existing rows are psychiatry);
--   2. allows practitioner_type = 'doctor' (a specialist doctor in any
--      non-mental-health specialty) alongside the four mental-health roles.
--
-- Run this BEFORE deploying the multispecialty site. Until it runs, the
-- server still saves psychiatry bookings (it retries without `specialty`),
-- but bookings for other specialties fall back to the lead file + alert.
-- Idempotent.
-- ============================================================

-- 1. Specialty on appointments
alter table public.appointments
  add column if not exists specialty text not null default 'psychiatry';

create index if not exists appointments_specialty_idx
  on public.appointments (specialty);

-- 2. Widen practitioner_type to include specialist doctors.
--    The original inline check has a generated name, so drop any check on
--    this column by inspecting the catalog, then add a named one.
do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'appointments'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%practitioner_type%'
  loop
    execute format('alter table public.appointments drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.appointments
  add constraint appointments_practitioner_type_check
  check (practitioner_type in ('psychiatrist','psychologist','therapist','counsellor','doctor'));

-- 3. Specialty on professional applications (the doctor directory)
alter table public.professional_applications
  add column if not exists specialty text not null default 'psychiatry';

create index if not exists professional_applications_specialty_idx
  on public.professional_applications (specialty);
