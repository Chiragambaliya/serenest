-- Serenest backend: run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- Creates tables and allows anonymous inserts (for signup forms). No auth required.

-- Sign-ups (email + mobile from homepage and profile)
create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  mobile text not null,
  created_at timestamptz not null default now()
);

-- Professional sign-ups (for-professionals page)
create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  mobile text not null,
  role text,
  created_at timestamptz not null default now()
);

-- Screening responses (answers from screening questionnaire)
create table if not exists public.screening_responses (
  id uuid primary key default gen_random_uuid(),
  reason text,
  conditions text[],
  format text,
  frequency text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.signups enable row level security;
alter table public.professionals enable row level security;
alter table public.screening_responses enable row level security;

-- Allow anyone to insert (anonymous signups from the website)
create policy "Allow anonymous insert on signups"
  on public.signups for insert
  with check (true);

create policy "Allow anonymous insert on professionals"
  on public.professionals for insert
  with check (true);

create policy "Allow anonymous insert on screening_responses"
  on public.screening_responses for insert
  with check (true);

-- Optional: prevent public read (only your backend or dashboard should read)
create policy "No public read on signups"
  on public.signups for select
  using (false);

create policy "No public read on professionals"
  on public.professionals for select
  using (false);

create policy "No public read on screening_responses"
  on public.screening_responses for select
  using (false);
