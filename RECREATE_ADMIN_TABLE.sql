-- ==========================================
-- EMERGENCY RE-CREATE: ADMIN USERS TABLE
-- ==========================================
-- You got "relation admin_users does not exist", meaning it wasn't successfully created.
-- This script explicitly creates it again.

create table if not exists public.admin_users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  password text not null, 
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Seed Default Admin
insert into public.admin_users (email, password)
values ('admin@gmail.com', 'admin123')
on conflict (email) do nothing;

-- Enable Policies again
alter table public.admin_users enable row level security;
drop policy if exists "Public Access" on public.admin_users;
create policy "Public Access" on public.admin_users for select using (true);
