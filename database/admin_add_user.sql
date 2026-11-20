-- Ohh-Exam — super admin can add a member from the Management pop-up.
-- Run once in Supabase → SQL Editor (after schema.sql and admin.sql).
-- The new account is ready to use straight away (no confirmation e-mail); the profile row
-- (username, role 'user') is made by the existing on_auth_user_created trigger.

create extension if not exists pgcrypto with schema extensions;

create or replace function public.admin_add_user(p_email text, p_username text, p_password text, p_role text default 'user')
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_id    uuid := gen_random_uuid();
  v_email text := lower(trim(coalesce(p_email, '')));
  v_user  text := lower(trim(p_username));
begin
  if not public.is_super_admin() then raise exception 'not allowed'; end if;
  if v_user !~ '^[a-z0-9._-]{3,20}$' then raise exception 'bad username'; end if;
  -- e-mail is optional: without one the account gets a placeholder address (never mailed);
  -- the member signs in with the username (email_for_username finds the placeholder)
  if v_email = '' then v_email := v_user || '@no-email.ohh-exam.local'; end if;
  if v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'bad email'; end if;
  if length(coalesce(p_password, '')) < 6 then raise exception 'password too short'; end if;
  if p_role not in ('user', 'super_admin') then raise exception 'bad role'; end if;
  if exists (select 1 from auth.users where lower(email) = v_email) then raise exception 'email already used'; end if;
  if exists (select 1 from public.profiles where username = v_user) then raise exception 'username already used'; end if;

  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
                          raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
                          confirmation_token, recovery_token, email_change_token_new, email_change)
  values ('00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', v_email,
          extensions.crypt(p_password, extensions.gen_salt('bf')), now(),
          '{"provider":"email","providers":["email"]}'::jsonb, jsonb_build_object('username', v_user),
          now(), now(), '', '', '', '');

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), v_id, v_id::text,
          jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true),
          'email', null, now(), now());

  if p_role <> 'user' then update public.profiles set role = p_role where id = v_id; end if;
  return v_id;
end $$;

revoke all on function public.admin_add_user(text, text, text, text) from public, anon;
grant execute on function public.admin_add_user(text, text, text, text) to authenticated;
