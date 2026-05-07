-- ============================================================
-- Serenest — Supabase Schema
-- Run in: Dashboard → SQL Editor → New query
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE)
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- ── Appointments (booking requests from patients) ────────────
create table if not exists public.appointments (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','cancelled','completed')),

  -- Patient info
  patient_name     text not null,
  patient_phone    text not null,
  patient_email    text,

  -- Session preferences
  practitioner_type text not null
                     check (practitioner_type in ('psychiatrist','psychologist','therapist','counsellor')),
  mode             text not null default 'video'
                     check (mode in ('video','audio','chat')),
  preferred_date   date not null,
  preferred_time   text not null,
  language         text not null default 'English',
  notes            text,

  -- Assigned professional (set by admin after confirmation)
  professional_id  uuid references public.professional_applications(id) on delete set null,

  -- Video room (Daily.co room name, set when session is confirmed)
  room_name        text
);

-- ── Patients ─────────────────────────────────────────────────
create table if not exists public.patients (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  name         text,
  phone        text,
  email        text,
  date_of_birth date,
  gender       text check (gender in ('male','female','non_binary','prefer_not_to_say')),
  city         text,
  language     text default 'English'
);

-- ── Professional applications (onboarding submissions) ───────
create table if not exists public.professional_applications (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  status       text not null default 'pending'
                 check (status in ('pending','approved','rejected')),
  role         text not null,
  role_label   text,
  full_name    text not null,
  phone        text not null,
  email        text,
  registration text,
  degree       text,
  year         text,
  council      text,
  clinic       text,
  city         text,
  languages    text,
  specialities text,
  fee_inr      text,
  duration_min int,
  modes        text,
  availability text
);

-- ── Sign-ups (email capture / waitlist) ──────────────────────
create table if not exists public.signups (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  mobile     text not null,
  created_at timestamptz not null default now()
);

-- ── Professionals (legacy quick-signup, pre-application) ─────
create table if not exists public.professionals (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  mobile     text not null,
  role       text,
  created_at timestamptz not null default now()
);

-- ── Screening responses ──────────────────────────────────────
create table if not exists public.screening_responses (
  id         uuid primary key default gen_random_uuid(),
  reason     text,
  conditions text[],
  format     text,
  frequency  text,
  created_at timestamptz not null default now()
);

-- ── Contact messages ─────────────────────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  email      text,
  phone      text,
  subject    text,
  message    text not null
);

-- ── Session notes (SOAP, locked after creation) ──────────────
create table if not exists public.session_notes (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  appointment_id  uuid not null references public.appointments(id) on delete cascade,
  professional_id uuid references public.professional_applications(id) on delete set null,
  subjective      text,
  objective       text,
  assessment      text,
  plan            text,
  is_locked       boolean not null default false,
  locked_at       timestamptz
);

-- ── Assessment responses (PHQ-9 / GAD-7) ────────────────────
create table if not exists public.assessments (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  appointment_id  uuid references public.appointments(id) on delete set null,
  patient_id      uuid references public.patients(id) on delete set null,
  type            text not null check (type in ('PHQ-9','GAD-7','mood')),
  answers         jsonb not null default '[]',
  score           int,
  severity        text
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists appointments_set_updated_at on public.appointments;
create trigger appointments_set_updated_at
  before update on public.appointments
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.appointments           enable row level security;
alter table public.patients               enable row level security;
alter table public.professional_applications enable row level security;
alter table public.signups                enable row level security;
alter table public.professionals          enable row level security;
alter table public.screening_responses    enable row level security;
alter table public.contact_messages       enable row level security;
alter table public.session_notes          enable row level security;
alter table public.assessments            enable row level security;

-- Drop old policies before recreating (idempotent)
do $$ declare r record;
begin
  for r in (select policyname, tablename from pg_policies where schemaname = 'public') loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- ── Appointments ─────────────────────────────────────────────
-- Anon can insert (booking form); read/update only via service role (server.js)
create policy "anon_insert_appointments"
  on public.appointments for insert
  with check (true);

-- Authenticated patients see only their own appointments (matched by phone)
create policy "auth_select_own_appointments"
  on public.appointments for select
  to authenticated
  using (true); -- Refine per patient_id once auth is wired

-- ── Patients ─────────────────────────────────────────────────
create policy "patient_select_own"
  on public.patients for select
  to authenticated
  using (auth.uid() = auth_user_id);

create policy "patient_insert_own"
  on public.patients for insert
  to authenticated
  with check (auth.uid() = auth_user_id);

create policy "patient_update_own"
  on public.patients for update
  to authenticated
  using (auth.uid() = auth_user_id);

-- ── Professional applications ─────────────────────────────────
create policy "anon_insert_prof_apps"
  on public.professional_applications for insert
  with check (true);

create policy "auth_select_prof_apps"
  on public.professional_applications for select
  to authenticated
  using (true);

create policy "auth_update_prof_apps"
  on public.professional_applications for update
  to authenticated
  using (true) with check (true);

-- ── Sign-ups ──────────────────────────────────────────────────
create policy "anon_insert_signups"
  on public.signups for insert
  with check (true);

create policy "auth_select_signups"
  on public.signups for select
  to authenticated
  using (true);

-- ── Professionals ─────────────────────────────────────────────
create policy "anon_insert_professionals"
  on public.professionals for insert
  with check (true);

create policy "auth_select_professionals"
  on public.professionals for select
  to authenticated
  using (true);

-- ── Screening responses ───────────────────────────────────────
create policy "anon_insert_screening"
  on public.screening_responses for insert
  with check (true);

create policy "auth_select_screening"
  on public.screening_responses for select
  to authenticated
  using (true);

-- ── Contact messages ──────────────────────────────────────────
create policy "anon_insert_contact"
  on public.contact_messages for insert
  with check (true);

create policy "auth_select_contact"
  on public.contact_messages for select
  to authenticated
  using (true);

-- ── Session notes ─────────────────────────────────────────────
create policy "auth_select_notes"
  on public.session_notes for select
  to authenticated
  using (true);

create policy "auth_insert_notes"
  on public.session_notes for insert
  to authenticated
  with check (true);

-- Locked notes cannot be updated (enforced by application logic + this policy)
create policy "auth_update_unlocked_notes"
  on public.session_notes for update
  to authenticated
  using (is_locked = false)
  with check (true);

-- ── Assessments ───────────────────────────────────────────────
create policy "anon_insert_assessments"
  on public.assessments for insert
  with check (true);

create policy "auth_select_assessments"
  on public.assessments for select
  to authenticated
  using (true);

-- ============================================================
-- AUTH TRIGGER
-- Mirrors new patient auth users into public.patients
-- ============================================================
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql
security definer set search_path = public
as $$
begin
  if (new.raw_user_meta_data ->> 'role') = 'patient' then
    insert into public.patients (auth_user_id, name, phone, email)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'name', ''),
      coalesce(new.raw_user_meta_data ->> 'phone', ''),
      new.email
    )
    on conflict (auth_user_id) do nothing;

    -- Legacy signups table
    insert into public.signups (email, mobile)
    values (
      new.email,
      coalesce(new.raw_user_meta_data ->> 'phone', '')
    )
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
