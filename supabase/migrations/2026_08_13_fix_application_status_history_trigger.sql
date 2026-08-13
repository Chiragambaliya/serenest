-- ============================================================
-- 2026-08-13 — Fix application_status_history FK / trigger
--
-- Production error on professional apply:
--   insert or update on table "application_status_history"
--   violates foreign key constraint
--   "application_status_history_application_id_fkey"
--
-- A trigger on professional_applications was writing history rows
-- in a way that violated the FK. This migration:
--   1) ensures the history table exists with a correct FK
--   2) replaces any broken trigger with a safe AFTER INSERT one
-- Idempotent.
-- ============================================================

-- History table (create if a prior dashboard migration invented it)
create table if not exists public.application_status_history (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  application_id uuid,
  old_status     text,
  new_status     text,
  note           text
);

-- Drop a broken FK if present, then re-add pointing at professional_applications.
do $$
begin
  if exists (
    select 1 from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'application_status_history'
      and constraint_name = 'application_status_history_application_id_fkey'
  ) then
    alter table public.application_status_history
      drop constraint application_status_history_application_id_fkey;
  end if;
end $$;

alter table public.application_status_history
  alter column application_id type uuid using application_id::uuid;

alter table public.application_status_history
  add constraint application_status_history_application_id_fkey
  foreign key (application_id)
  references public.professional_applications(id)
  on delete cascade
  deferrable initially deferred;

-- Remove any existing triggers that write status history (names may vary).
do $$
declare
  r record;
begin
  for r in
    select tgname
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'professional_applications'
      and not t.tgisinternal
      and (
        pg_get_triggerdef(t.oid) ilike '%application_status_history%'
        or tgname ilike '%status_history%'
        or tgname ilike '%application_status%'
      )
  loop
    execute format('drop trigger if exists %I on public.professional_applications', r.tgname);
  end loop;
end $$;

-- Safe history writer: AFTER INSERT / UPDATE OF status only.
create or replace function public.log_professional_application_status()
returns trigger
language plpgsql
as $$
begin
  if TG_OP = 'INSERT' then
    insert into public.application_status_history (application_id, old_status, new_status, note)
    values (NEW.id, null, coalesce(NEW.status, 'pending'), 'application created');
    return NEW;
  end if;

  if TG_OP = 'UPDATE' and NEW.status is distinct from OLD.status then
    insert into public.application_status_history (application_id, old_status, new_status, note)
    values (NEW.id, OLD.status, NEW.status, 'status changed');
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_professional_application_status_history
  on public.professional_applications;

create trigger trg_professional_application_status_history
  after insert or update of status
  on public.professional_applications
  for each row
  execute function public.log_professional_application_status();
