-- Ohh-Exam — Supabase schema
-- Run once in the SQL editor of the Supabase project (or via migration).

-- One row per user: the whole game state (XP, streak, finished lessons) as JSON.
create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb       not null default '{}'::jsonb,
  xp         integer     not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Each signed-in user can only see and change their own row.
drop policy if exists "Read own progress"   on public.progress;
drop policy if exists "Insert own progress" on public.progress;
drop policy if exists "Update own progress" on public.progress;

create policy "Read own progress" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Insert own progress" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own progress" on public.progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
