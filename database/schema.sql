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

-- ---------------------------------------------------------------------------
-- Usernames: sign up with email + username, sign in with username OR email.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text not null unique check (username ~ '^[a-z0-9._-]{3,20}$'),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);

-- Create the profile row from the username given at sign-up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, username)
  values (new.id, lower(new.raw_user_meta_data ->> 'username'));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Is this username still free? (used by the sign-up form)
create or replace function public.username_available(p_username text)
returns boolean language sql stable security definer set search_path = '' as $$
  select not exists (select 1 from public.profiles where username = lower(p_username));
$$;

-- Username → email, so the login form can sign in with a username.
-- Trade-off: anyone who knows a username can look up its email address.
create or replace function public.email_for_username(p_username text)
returns text language sql stable security definer set search_path = '' as $$
  select u.email from auth.users u join public.profiles p on p.id = u.id
  where p.username = lower(p_username);
$$;

revoke all on function public.username_available(text) from public;
revoke all on function public.email_for_username(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;
grant execute on function public.email_for_username(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Roles: 'user' (default) or 'super_admin'.
-- Promote someone AFTER they have signed up (run in the SQL editor, not in code):
--   update public.profiles set role = 'super_admin'
--   where id = (select id from auth.users where email = '<their email>');
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists role text not null default 'user'
  check (role in ('user', 'super_admin'));

-- Users must not be able to change their own role (there is no update policy on profiles).
create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'super_admin');
$$;
revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

-- Lock down (advisor): the trigger function is not callable over the API; role check needs a signed-in user.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_super_admin() from anon;
