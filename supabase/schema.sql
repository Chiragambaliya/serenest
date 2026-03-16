-- Serenest backend: run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- Creates tables, RLS policies, and auth trigger.

-- ============================================================
-- TABLES
-- ============================================================

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

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
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

-- Authenticated users can read all data (professionals dashboard)
create policy "Authenticated users can read signups"
  on public.signups for select
  to authenticated
  using (true);

create policy "Authenticated users can read professionals"
  on public.professionals for select
  to authenticated
  using (true);

create policy "Authenticated users can read screening_responses"
  on public.screening_responses for select
  to authenticated
  using (true);

-- ============================================================
-- AUTH TRIGGER
-- Automatically create a row in public.signups when a new
-- patient user signs up via Supabase Auth (role = 'patient').
-- ============================================================
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Only mirror patients into the signups table
  if (new.raw_user_meta_data ->> 'role') = 'patient' then
    insert into public.signups (email, mobile)
    values (
      new.email,
      coalesce(new.raw_user_meta_data ->> 'mobile', '')
    )
    on conflict do nothing;
  end if;
  return new;
end;
$$;

-- Drop trigger first in case you are re-running the script
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
