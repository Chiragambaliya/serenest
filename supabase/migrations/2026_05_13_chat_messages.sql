-- ============================================================
-- 2026-05-13 — Consultation side-channel chat (`chat_messages`)
--
-- Enables Supabase realtime + anon insert/select for threads that match
-- a real booking row (`appointments.id` or `appointments.appointment_id`)
-- via a SECURITY DEFINER helper (anon cannot read appointments directly).
--
-- Safe to re-run (IF NOT EXISTS / DROP IF EXISTS guards).
-- ============================================================

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

alter table public.chat_messages enable row level security;

-- Grant API roles (anon = browser consultations without login)
grant select, insert on public.chat_messages to anon, authenticated;

-- Validate thread id without granting anon SELECT on appointments
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

drop policy if exists anon_authenticated_select_chat_messages on public.chat_messages;
drop policy if exists anon_authenticated_insert_chat_messages on public.chat_messages;

create policy anon_authenticated_select_chat_messages
  on public.chat_messages
  for select
  to anon, authenticated
  using (public.chat_appointment_is_valid(appointment_id));

create policy anon_authenticated_insert_chat_messages
  on public.chat_messages
  for insert
  to anon, authenticated
  with check (
    public.chat_appointment_is_valid(appointment_id)
    and sender_role in ('participant', 'professional', 'admin')
    and char_length(trim(sender_name)) between 1 and 128
    and char_length(trim(message)) between 1 and 4000
  );

-- Realtime: broadcast inserts to subscribed clients (Supabase Postgres changes)
do $pub$
declare
  reg boolean;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    return;
  end if;

  select exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'chat_messages'
  )
  into reg;

  if reg is distinct from true then
    execute 'alter publication supabase_realtime add table public.chat_messages';
  end if;
end $pub$;
