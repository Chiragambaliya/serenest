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
alter table public.chat_messages          enable row level security;
alter table public.session_notes          enable row level security;
alter table public.assessments            enable row level security;
alter table public.pro_learning_progress   enable row level security;

-- Drop old policies before recreating (idempotent)
do $$ declare r record;
begin
  for r in (select policyname, tablename from pg_policies where schemaname = 'public') loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- ── Helper: last-10-digit phone comparison ────────────────────
-- Indian mobiles are stored as 10 digits; JWT phone claims may
-- carry a country code. Empty values never match.
create or replace function public.phones_match(a text, b text)
returns boolean
language sql
immutable
as $$
  select coalesce(a, '') <> ''
     and coalesce(b, '') <> ''
     and right(regexp_replace(a, '\D', '', 'g'), 10)
       = right(regexp_replace(b, '\D', '', 'g'), 10)
     and length(regexp_replace(a, '\D', '', 'g')) >= 10
     and length(regexp_replace(b, '\D', '', 'g')) >= 10;
$$;

-- ── Appointments ─────────────────────────────────────────────
-- Anon can insert (booking form); read/update only via service role (server.js)
create policy "anon_insert_appointments"
  on public.appointments for insert
  with check (true);

-- Authenticated patients see only their own appointments,
-- matched by the verified email/phone on their JWT or the phone
-- stored on their patients row.
create policy "auth_select_own_appointments"
  on public.appointments for select
  to authenticated
  using (
    (coalesce(patient_email, '') <> ''
      and lower(patient_email) = lower(coalesce(auth.jwt() ->> 'email', '')))
    or public.phones_match(patient_phone, auth.jwt() ->> 'phone')
    or exists (
      select 1 from public.patients p
      where p.auth_user_id = (select auth.uid())
        and public.phones_match(p.phone, patient_phone)
    )
  );

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
-- Anyone can apply; a professional can read/update only the row
-- matching the verified email on her JWT. Admin review happens
-- through server.js (service role).
create policy "anon_insert_prof_apps"
  on public.professional_applications for insert
  with check (true);

create policy "auth_select_own_application"
  on public.professional_applications for select
  to authenticated
  using (
    coalesce(email, '') <> ''
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "auth_update_own_application"
  on public.professional_applications for update
  to authenticated
  using (
    coalesce(email, '') <> ''
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  with check (
    coalesce(email, '') <> ''
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- ── Sign-ups (insert-only; read via service role) ─────────────
create policy "anon_insert_signups"
  on public.signups for insert
  with check (true);

-- ── Professionals (insert-only; read via service role) ────────
create policy "anon_insert_professionals"
  on public.professionals for insert
  with check (true);

-- ── Screening responses (insert-only; read via service role) ──
create policy "anon_insert_screening"
  on public.screening_responses for insert
  with check (true);

-- ── Contact messages (insert-only; read via service role) ─────
create policy "anon_insert_contact"
  on public.contact_messages for insert
  with check (true);

-- ── Session notes ─────────────────────────────────────────────
-- Clinical notes are managed exclusively by server.js (service
-- role bypasses RLS). No client policies = deny-all for clients.

-- ── Assessments ───────────────────────────────────────────────
-- Insert-only for clients; reads happen via the service role.
create policy "anon_insert_assessments"
  on public.assessments for insert
  with check (true);

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

grant select, insert on public.chat_messages to anon, authenticated;

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
