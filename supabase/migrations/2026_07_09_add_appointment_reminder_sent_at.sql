-- Appointment reminders: the reminder cron in server.js emails patients
-- (and their assigned professional) ~24h before a confirmed session, then
-- stamps this column so each appointment is reminded exactly once.
alter table appointments
  add column if not exists reminder_sent_at timestamptz;
