-- Professional learning progress (requires Supabase Auth client sync — table ready for Phase 2)
-- Idempotent: safe to re-run.

create table if not exists public.pro_learning_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  module_id     text not null,
  completed_at  timestamptz not null default now(),
  unique (user_id, module_id)
);

create index if not exists pro_learning_progress_user_idx
  on public.pro_learning_progress (user_id);

alter table public.pro_learning_progress enable row level security;

drop policy if exists "pro_learning_select_own" on public.pro_learning_progress;
drop policy if exists "pro_learning_insert_own" on public.pro_learning_progress;
drop policy if exists "pro_learning_update_own" on public.pro_learning_progress;
drop policy if exists "pro_learning_delete_own" on public.pro_learning_progress;

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
