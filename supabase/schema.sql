-- ============================================================
-- Serenest — Supabase Schema
-- Run in: Dashboard → SQL Editor → New query
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE) and safe to apply
-- in a single pass on a brand-new database (tables are created in
-- dependency order so foreign keys never reference a missing table).
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES  (ordered so foreign keys reference already-created tables)
-- ============================================================

-- ── Professional applications (onboarding submissions) ───────
-- Created first: `appointments` and `session_notes` reference it.
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
  availability text,
  modes        text
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

-- ── Appointments (booking requests from patients) ────────────
create table if not exists public.appointments (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','cancelled','completed')),

  -- Human-friendly id (legacy / video-room thread id). Auto-filled by a
  -- trigger below from the uuid `id` when not supplied on insert.
  appointment_id   text,

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

-- Upgrade older databases (created by a previous version of this schema)
-- that lack the human-friendly `appointment_id` column.
alter table public.appointments
  add column if not exists appointment_id text;

create index if not exists appointments_status_idx         on public.appointments (status);
create index if not exists appointments_created_at_idx     on public.appointments (created_at desc);
create index if not exists appointments_preferred_date_idx on public.appointments (preferred_date);

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

-- ── Screening responses (PHQ-9 + GAD-7 self-screening) ───────
-- Shape matches POST /api/screening in server.js.
create table if not exists public.screening_responses (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text,
  phone         text,
  email         text,
  reason        text,
  conditions    text[],
  format        text,
  frequency     text,
  phq9_answers  jsonb,
  phq9_score    int,
  phq9_severity text,
  gad7_answers  jsonb,
  gad7_score    int,
  gad7_severity text,
  wants_callback boolean not null default false,
  status        text not null default 'new'
);

-- Upgrade older databases that used the original (reason/conditions-only) shape.
alter table public.screening_responses
  add column if not exists name          text,
  add column if not exists phone         text,
  add column if not exists email         text,
  add column if not exists phq9_answers  jsonb,
  add column if not exists phq9_score    int,
  add column if not exists phq9_severity text,
  add column if not exists gad7_answers  jsonb,
  add column if not exists gad7_score    int,
  add column if not exists gad7_severity text,
  add column if not exists wants_callback boolean not null default false,
  add column if not exists status        text not null default 'new';

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

-- ── Consultation chat (per appointment thread; used by ConsultationPage) ──
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  appointment_id text not null,
  sender_name text not null,
  sender_role text not null default 'participant',
  message text not null,
  constraint chat_messages_message_len check (char_length(trim(message)) between 1 and 4000),
  constraint chat_messages_sender_len check (char_length(trim(sender_name)) between 1 and 128)
);

create index if not exists chat_messages_appointment_created_idx
  on public.chat_messages (appointment_id, created_at asc);

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

-- ── Professional learning progress (Supabase Auth — sync from app when pro login exists) ──
create table if not exists public.pro_learning_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  module_id     text not null,
  completed_at  timestamptz not null default now(),
  unique (user_id, module_id)
);

create index if not exists pro_learning_progress_user_idx
  on public.pro_learning_progress (user_id);

-- ============================================================
-- HIRING PIPELINE TABLES (used by server.js /api/jobs + /api/hiring)
-- ============================================================

-- ── Job postings ─────────────────────────────────────────────
create table if not exists public.job_postings (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  title        text not null,
  department   text not null,
  location     text not null default 'Remote',
  type         text not null default 'full_time',
  description  text,
  requirements text,
  salary_range text,
  closes_at    date,
  is_open      boolean not null default true
);

create index if not exists job_postings_open_idx on public.job_postings (is_open, created_at desc);

-- ── Job applications ─────────────────────────────────────────
create table if not exists public.job_applications (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  full_name        text not null,
  email            text not null,
  phone            text,
  city             text,
  linkedin_url     text,
  portfolio_url    text,
  cover_note       text,
  department       text not null,
  role             text not null,
  resume_url       text,
  status           text not null default 'new'
                     check (status in ('new','reviewing','shortlisted','interviewing','hired','rejected')),
  hr_notes         text,
  -- Offer fields (set by admin via /api/hiring/offer)
  offer_salary     text,
  offer_date       date,
  offer_deadline   date,
  joining_date     date,
  offer_accepted   boolean,
  rejection_reason text
);

create index if not exists job_applications_status_idx     on public.job_applications (status);
create index if not exists job_applications_department_idx on public.job_applications (department);
create index if not exists job_applications_created_at_idx on public.job_applications (created_at desc);

-- ── Interview schedules ──────────────────────────────────────
create table if not exists public.interview_schedules (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  application_id   uuid not null references public.job_applications(id) on delete cascade,
  round            int not null default 1,
  interview_type   text not null default 'video',
  scheduled_at     timestamptz not null,
  duration_min     int not null default 45,
  interviewer_name text,
  meeting_link     text,
  notes            text,
  outcome          text not null default 'pending',
  outcome_notes    text
);

create index if not exists interview_schedules_application_idx on public.interview_schedules (application_id);
create index if not exists interview_schedules_scheduled_idx   on public.interview_schedules (scheduled_at);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Keep updated_at fresh on each appointment update.
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

-- Auto-fill the human-friendly appointment_id from the uuid id when missing,
-- so video-room / chat code paths that rely on it keep working.
create or replace function public.set_appointment_id_default()
returns trigger language plpgsql as $$
begin
  if new.appointment_id is null then
    new.appointment_id := 'APT-' || upper(substr(replace(new.id::text, '-', ''), 1, 8));
  end if;
  return new;
end;
$$;

drop trigger if exists trg_appointments_set_id on public.appointments;
create trigger trg_appointments_set_id
  before insert on public.appointments
  for each row execute function public.set_appointment_id_default();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.appointments              enable row level security;
alter table public.patients                  enable row level security;
alter table public.professional_applications enable row level security;
alter table public.signups                   enable row level security;
alter table public.professionals             enable row level security;
alter table public.screening_responses       enable row level security;
alter table public.contact_messages          enable row level security;
alter table public.chat_messages             enable row level security;
alter table public.session_notes             enable row level security;
alter table public.assessments               enable row level security;
alter table public.pro_learning_progress     enable row level security;
alter table public.job_postings              enable row level security;
alter table public.job_applications          enable row level security;
alter table public.interview_schedules       enable row level security;

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

-- ── Professional learning progress ────────────────────────────
create policy "pro_learning_select_own"
  on public.pro_learning_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "pro_learning_insert_own"
  on public.pro_learning_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "pro_learning_update_own"
  on public.pro_learning_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "pro_learning_delete_own"
  on public.pro_learning_progress for delete
  to authenticated
  using (auth.uid() = user_id);

-- ── Job postings (public careers page can read open roles) ────
create policy "anon_select_open_jobs"
  on public.job_postings for select
  to anon
  using (is_open = true);

create policy "auth_select_jobs"
  on public.job_postings for select
  to authenticated
  using (true);

-- ── Job applications (public apply form; admin reads via service role) ──
create policy "anon_insert_job_applications"
  on public.job_applications for insert
  with check (true);

create policy "auth_select_job_applications"
  on public.job_applications for select
  to authenticated
  using (true);

-- ── Interview schedules (admin-managed via service role) ──────
create policy "auth_select_interviews"
  on public.interview_schedules for select
  to authenticated
  using (true);

-- ── Chat messages (consultation; anon uses SECURITY DEFINER validation) ──
create or replace function public.chat_appointment_is_valid(thread_id text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.appointments a
    where thread_id is not null
      and thread_id <> ''
      and (
        (a.appointment_id is not null and a.appointment_id = thread_id)
        or a.id::text = thread_id
      )
  );
$$;

revoke all on function public.chat_appointment_is_valid(text) from public;
grant execute on function public.chat_appointment_is_valid(text)
  to anon, authenticated, service_role;

create policy "anon_authenticated_select_chat_messages"
  on public.chat_messages for select
  to anon, authenticated
  using (public.chat_appointment_is_valid(appointment_id));

create policy "anon_authenticated_insert_chat_messages"
  on public.chat_messages for insert
  to anon, authenticated
  with check (
    public.chat_appointment_is_valid(appointment_id)
    and sender_role in ('participant', 'professional', 'admin')
    and char_length(trim(sender_name)) between 1 and 128
    and char_length(trim(message)) between 1 and 4000
  );

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

-- ============================================================
-- GRANTS (Supabase API roles)
-- RLS policies above still govern row-level access for anon/authenticated;
-- the service_role (used by server.js) bypasses RLS. These grants make the
-- schema self-contained when applied outside the Supabase SQL Editor (e.g.
-- via psql), where default privileges are not auto-applied.
-- ============================================================
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables    in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables    to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
