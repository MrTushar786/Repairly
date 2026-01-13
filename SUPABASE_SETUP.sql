-- ==========================================
-- REPAIRLY DATABASE SETUP SCRIPT
-- ==========================================
-- Copy this ENTIRE file and paste it into the Supabase SQL Editor.
-- Then click "Run".

-- 1. Device Models (For the repair intake form)
create table if not exists device_models (
  id uuid default gen_random_uuid() primary key,
  category text,
  brand text,
  model text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table device_models enable row level security;
drop policy if exists "Public Read" on device_models;
create policy "Public Read" on device_models for select using (true);
drop policy if exists "Admin Write" on device_models;
create policy "Admin Write" on device_models for all to authenticated using (true);

-- 2. Service Menu Items (For the main navigation)
create table if not exists service_menu_items (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table service_menu_items enable row level security;
drop policy if exists "Public Read" on service_menu_items;
create policy "Public Read" on service_menu_items for select using (true);
drop policy if exists "Admin Write" on service_menu_items;
create policy "Admin Write" on service_menu_items for all to authenticated using (true);

-- 3. Site Settings (For Business Hours, Location, etc.)
create table if not exists site_settings (
  key text primary key,
  value jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table site_settings enable row level security;
drop policy if exists "Public Read" on site_settings;
create policy "Public Read" on site_settings for select using (true);
drop policy if exists "Admin Write" on site_settings;
create policy "Admin Write" on site_settings for all to authenticated using (true);

-- 4. Device Inventory (For the Shop/Store)
create table if not exists device_inventory (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  brand text default 'Apple',
  model text,
  price numeric default 0,
  condition text default 'Refurbished',
  storage text,
  color text,
  status text default 'Available',
  image_url text,
  description text,
  category text default 'Phones',
  quantity integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
-- Ensure column exists for existing tables
do $$ 
begin 
    if not exists (select 1 from information_schema.columns where table_name = 'device_inventory' and column_name = 'quantity') then 
        alter table device_inventory add column quantity integer default 1; 
    end if; 
end $$;
alter table device_inventory enable row level security;
drop policy if exists "Public Read" on device_inventory;
create policy "Public Read" on device_inventory for select using (true);
drop policy if exists "Admin Write" on device_inventory;
create policy "Admin Write" on device_inventory for all to authenticated using (true);

-- 5. Storage (For uploading images)
-- Create the 'images' bucket if it doesn't exist
insert into storage.buckets (id, name, public) 
values ('images', 'images', true) 
on conflict (id) do nothing;

-- Allow public to SEE images
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'images' );

-- Allow logged-in admin to UPLOAD images
drop policy if exists "Auth Upload" on storage.objects;
create policy "Auth Upload" 
on storage.objects for insert 
with check ( bucket_id = 'images' and auth.role() = 'authenticated' );
