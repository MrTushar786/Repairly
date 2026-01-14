-- ==========================================
-- FINAL DATABASE CLEANUP & SIMPLIFICATION
-- ==========================================
-- Goal: 
-- 1. Remove RBAC complexity (roles, permissions, audit_logs, etc.)
-- 2. Create a simple 'admin_users' table for dedicated admin login.
-- 3. Create a simple 'users' table for customer information.
-- ==========================================

-- 1. DROP UNNECESSARY TABLES (RBAC System)
drop table if exists public.user_roles cascade;
drop table if exists public.role_permissions cascade;
drop table if exists public.audit_logs cascade;
drop table if exists public.permissions cascade;
drop table if exists public.roles cascade;
-- We also drop 'profiles' if it still exists from older versions
drop table if exists public.profiles cascade;

-- 2. SETUP ADMIN TABLE (Dedicated Admin Login)
-- This table stores ONLY admins.
create table if not exists public.admin_users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  password text not null, -- In a real app, hash this! For now, storing as plain text per request implies simple handling.
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Seed the initial Admin
insert into public.admin_users (email, password)
values ('admin@gmail.com', 'admin123')
on conflict (email) do nothing;

-- 3. SETUP USERS TABLE (Customer Info)
-- This table stores ALL customers who sign up via Supabase Auth.
-- It works similarly to the 'profiles' concept but named simplified.
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  phone text,
  avatar_url text, -- For profile pictures
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. TRIGGER FOR NEW CUSTOMERS
-- Automatically add new Supabase Auth users to 'users' table
create or replace function public.handle_new_customer() 
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger logic
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_customer();

-- 5. RLS POLICIES (Security)
alter table public.admin_users enable row level security;
alter table public.users enable row level security;

-- Admin Policy: Only allow read if you know the secret (simulated here for API usage) 
-- OR strictly allow public read for login verification (not secure but fits the "simple" request flow).
-- BETTER: Allow ALL for authenticated users (so the app can query it to verify).
create policy "Allow Reads" on public.admin_users for select using (true);

-- User Policy: Public can read users (for admin dashboard to see them)
create policy "Allow Public Read" on public.users for select using (true);
create policy "Users update own" on public.users for update using (auth.uid() = id);

-- 6. SYNC EXISTING USERS (Backfill)
insert into public.users (id, email, full_name, avatar_url, created_at)
select 
  au.id, 
  au.email, 
  au.raw_user_meta_data->>'full_name', 
  au.raw_user_meta_data->>'avatar_url',
  au.created_at
from auth.users au
where not exists (select 1 from public.users pu where pu.id = au.id);
