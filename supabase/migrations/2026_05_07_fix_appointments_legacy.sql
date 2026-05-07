-- ============================================================
-- 2026-05-07 — Bring legacy `appointments` table in sync with
-- the booking form schema (see schema.sql).
--
-- The production DB had been created with an older video-room
-- variant of this table (appointment_id NOT NULL, doctor_name,
-- daily_room_*, etc.) and was missing the new booking columns,
-- so POST /api/bookings was failing with 500.
--
-- This migration is idempotent — safe to re-run.
-- ============================================================

alter table public.appointments
  add column if not exists updated_at       timestamptz not null default now(),
  add column if not exists patient_phone     text,
  add column if not exists practitioner_type text,
  add column if not exists mode              text default 'video',
  add column if not exists preferred_date    date,
  add column if not exists preferred_time    text,
  add column if not exists language          text default 'English',
  add column if not exists notes             text,
  add column if not exists professional_id   uuid;

-- Make the legacy NOT NULL column optional so new inserts work
alter table public.appointments alter column appointment_id drop not null;

-- Auto-fill the legacy appointment_id from the new uuid id when missing,
-- so old code paths that rely on it (e.g. video-room flow) keep working.
create or replace function public.set_appointment_id_default()
returns trigger language plpgsql as $$
begin
  if new.appointment_id is null then
    new.appointment_id := 'APT-' || upper(substr(replace(new.id::text, '-', ''), 1, 8));
  end if;
  return new;
end $$;

drop trigger if exists trg_appointments_set_id on public.appointments;
create trigger trg_appointments_set_id
  before insert on public.appointments
  for each row execute function public.set_appointment_id_default();

-- Keep updated_at fresh on each update (admin status/action buttons depend on this
-- because server.js updates `updated_at` in PATCH /api/bookings/:id/status).
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
  before update on public.appointments
  for each row execute procedure public.set_updated_at();

-- Helpful indexes for admin dashboard
create index if not exists appointments_status_idx         on public.appointments (status);
create index if not exists appointments_created_at_idx     on public.appointments (created_at desc);
create index if not exists appointments_preferred_date_idx on public.appointments (preferred_date);
