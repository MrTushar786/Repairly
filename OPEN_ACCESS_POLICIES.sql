-- ==========================================
-- OPEN ACCESS POLICIES (For Custom Admin System)
-- ==========================================
-- Since we are using a custom 'admin_users' table and bypassing Supabase Auth,
-- the Admin Dashboard requests appear as "Anonymous" (Public) to the database.
-- We must allow Public Read/Write access to the necessary tables for the Admin Panel to work.
-- NOTE: This relies on the Frontend Application (Admin Panel) to protect the UI.

-- Helper macro to enable public access
-- (We drop existing policies to ensure no conflicts)

-- 1. BOOKINGS
alter table public.bookings enable row level security;
drop policy if exists "Public Access" on public.bookings;
create policy "Public Access" on public.bookings for all using (true) with check (true);

-- 2. SUPPORT TICKETS
alter table public.support_tickets enable row level security;
drop policy if exists "Public Access" on public.support_tickets;
create policy "Public Access" on public.support_tickets for all using (true) with check (true);

-- 3. INVENTORY & SERVICES
alter table public.device_inventory enable row level security;
drop policy if exists "Public Access" on public.device_inventory;
create policy "Public Access" on public.device_inventory for all using (true) with check (true);

alter table public.repair_services enable row level security;
drop policy if exists "Public Access" on public.repair_services;
create policy "Public Access" on public.repair_services for all using (true) with check (true);

-- 4. MENU & MODELS
alter table public.service_menu_items enable row level security;
drop policy if exists "Public Access" on public.service_menu_items;
create policy "Public Access" on public.service_menu_items for all using (true) with check (true);

alter table public.device_models enable row level security;
drop policy if exists "Public Access" on public.device_models;
create policy "Public Access" on public.device_models for all using (true) with check (true);

-- 5. SITE SETTINGS
alter table public.site_settings enable row level security;
drop policy if exists "Public Access" on public.site_settings;
create policy "Public Access" on public.site_settings for all using (true) with check (true);

-- 6. USERS (Already done, but ensuring)
alter table public.users enable row level security;
drop policy if exists "Public Access" on public.users;
create policy "Public Access" on public.users for all using (true) with check (true);

-- 7. ADMIN USERS (Read Only for Login)
alter table public.admin_users enable row level security;
drop policy if exists "Public Access" on public.admin_users;
create policy "Public Access" on public.admin_users for select using (true);

-- 8. STORAGE (If you have images)
-- insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict do nothing;
-- create policy "Public Objects" on storage.objects for all using ( bucket_id = 'images' ) with check ( bucket_id = 'images' );
