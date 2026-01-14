-- ==========================================
-- SYNC SCRIPT: FIX MISSING USER PROFILES
-- ==========================================
-- Run this if you get "Key (user_id) is not present in table users" error.
-- This happens because existing users were created BEFORE we set up the 'users' table trigger.

-- 1. Backfill public.users from auth.users
insert into public.users (id, email, full_name, avatar_url, created_at, updated_at)
select 
  au.id, 
  au.email, 
  au.raw_user_meta_data->>'full_name', 
  au.raw_user_meta_data->>'avatar_url',
  au.created_at,
  au.updated_at
from auth.users au
where not exists (
  select 1 from public.users pu where pu.id = au.id
);

-- 2. NOW you can safely assign the Admin Role
do $$
declare
  my_uid uuid;
  admin_role_id bigint;
begin
  -- REPLACE WITH YOUR ACTUAL EMAIL
  select id into my_uid from auth.users where email = 'admin@gmail.com'; 
  
  select id into admin_role_id from public.roles where name = 'admin';

  if my_uid is not null and admin_role_id is not null then
    insert into public.user_roles (user_id, role_id)
    values (my_uid, admin_role_id)
    on conflict do nothing;
    raise notice 'Admin role assigned successfully to %', my_uid;
  else
    raise notice 'User or Role not found. Check email spelling.';
  end if;
end $$;
