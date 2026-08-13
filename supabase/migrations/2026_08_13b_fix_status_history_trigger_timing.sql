-- ============================================================
-- 2026-08-13b — Fix status-history trigger timing (supersedes
-- 2026_08_13_fix_application_status_history_trigger.sql)
--
-- Root cause of "Failed to submit application. Please try again."
-- and of zero rows ever reaching professional_applications:
--
--   trg_log_application_status_change was BEFORE INSERT OR UPDATE.
--   On INSERT it wrote application_status_history(application_id => NEW.id)
--   before the parent row existed, so every insert died with:
--     23503 insert or update on table "application_status_history"
--     violates foreign key constraint
--     "application_status_history_application_id_fkey"
--
-- Fix: split the trigger by operation.
--   INSERT -> AFTER  (parent row committed to the table, FK satisfied)
--   UPDATE -> BEFORE (parent already exists; preserves NEW.updated_at := now())
--
-- log_application_status_change() already branches on TG_OP and is reused
-- unchanged, so the changed_by / changed_by_email / source audit columns keep
-- being populated exactly as before.
--
-- Idempotent.
-- ============================================================

drop trigger if exists trg_log_application_status_change
  on public.professional_applications;

drop trigger if exists trg_log_application_status_change_ins
  on public.professional_applications;
drop trigger if exists trg_log_application_status_change_upd
  on public.professional_applications;

create trigger trg_log_application_status_change_ins
  after insert on public.professional_applications
  for each row
  execute function public.log_application_status_change();

create trigger trg_log_application_status_change_upd
  before update on public.professional_applications
  for each row
  execute function public.log_application_status_change();
