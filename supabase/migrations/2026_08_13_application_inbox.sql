-- ============================================================
-- 2026-08-13 — Durable application inbox
--
-- professional_applications inserts can fail in production
-- (legacy triggers / schema drift). The local JSONL fallback is
-- ephemeral on Render. This table is a trigger-free inbox that
-- always accepts clinician applications so Admin can see them.
-- Idempotent.
-- ============================================================

create table if not exists public.application_inbox (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  source                  text not null default 'professionals_apply',
  status                  text not null default 'pending'
                            check (status in ('pending','promoted','discarded')),
  full_name               text not null,
  phone                   text not null,
  email                   text,
  role                    text,
  role_label              text,
  social_handle           text,
  registration            text,
  degree                  text,
  city                    text,
  languages               text,
  specialities            text,
  fee_inr                 text,
  duration_min            integer,
  modes                   text,
  availability            text,
  payload                 jsonb not null default '{}'::jsonb,
  db_error                text,
  promoted_application_id uuid
);

create index if not exists application_inbox_created_at_idx
  on public.application_inbox (created_at desc);

create index if not exists application_inbox_status_idx
  on public.application_inbox (status);

alter table public.application_inbox enable row level security;
