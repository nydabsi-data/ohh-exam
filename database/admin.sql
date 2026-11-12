-- Ohh-Exam — super admin functions for the Management pop-up.
-- Run once in Supabase → SQL Editor (after schema.sql).

-- All members with their XP and activity. Only a super admin may call it.
create or replace function public.admin_list_users()
returns table (id uuid, username text, email text, role text, xp integer,
               created_at timestamptz, last_sign_in_at timestamptz, progress_updated timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_super_admin() then raise exception 'not allowed'; end if;
  return query
    select p.id, p.username, u.email::text, p.role, coalesce(g.xp, 0), u.created_at, u.last_sign_in_at, g.updated_at
    from public.profiles p
    join auth.users u on u.id = p.id
    left join public.progress g on g.user_id = p.id
    order by u.created_at desc;
end $$;

-- Change someone's role. A super admin cannot change their own role (no accidental lock-out).
create or replace function public.admin_set_role(p_user uuid, p_role text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_super_admin() then raise exception 'not allowed'; end if;
  if p_role not in ('user', 'super_admin') then raise exception 'bad role'; end if;
  if p_user = (select auth.uid()) then raise exception 'cannot change your own role'; end if;
  update public.profiles set role = p_role where id = p_user;
end $$;

revoke all on function public.admin_list_users() from public, anon;
revoke all on function public.admin_set_role(uuid, text) from public, anon;
grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_set_role(uuid, text) to authenticated;
