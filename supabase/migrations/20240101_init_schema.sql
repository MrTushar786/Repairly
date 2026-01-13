-- Migration to create all necessary tables and security policies for Repairly

-- 1. Profiles Table (for Users/Admins)
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  email text not null,
  role text default 'customer', -- 'admin' or 'customer'
  full_name text,
  phone text,
  address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.profiles enable row level security;

-- Policies for Profiles
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone" on profiles for select using (true);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);


-- 2. Bookings Table (Repair Appointments)
create table if not exists public.bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  device_type text not null,
  device_brand text,
  device_model text,
  issue_description text,
  status text default 'Pending', -- Pending, In Progress, Completed, Cancelled
  estimated_cost text,
  appointment_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.bookings enable row level security;

-- Policies for Bookings
drop policy if exists "Users can view own bookings" on bookings;
create policy "Users can view own bookings" on bookings for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own bookings" on bookings;
create policy "Users can insert own bookings" on bookings for insert with check (auth.uid() = user_id);

drop policy if exists "Admins can view all bookings" on bookings;
create policy "Admins can view all bookings" on bookings for select using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

drop policy if exists "Admins can update all bookings" on bookings;
create policy "Admins can update all bookings" on bookings for update using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- 3. Support Tickets Table
create table if not exists public.support_tickets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id), -- Optional, can be null for guests if allowed, currently strict
  name text,
  email text,
  subject text,
  message text,
  status text default 'Open', -- Open, Closed
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.support_tickets enable row level security;

-- Policies for Support Tickets
drop policy if exists "Users can insert tickets" on support_tickets;
create policy "Users can insert tickets" on support_tickets for insert with check (true);

drop policy if exists "Users can view own tickets" on support_tickets;
create policy "Users can view own tickets" on support_tickets for select using (auth.uid() = user_id);

drop policy if exists "Admins can view all tickets" on support_tickets;
create policy "Admins can view all tickets" on support_tickets for select using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- 4. Device Models Table (For Dynamic Search)
create table if not exists public.device_models (
  id uuid default gen_random_uuid() primary key,
  category text, -- Phone, Laptop, Tablet, Console
  brand text,
  model text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.device_models enable row level security;

-- Policies for Device Models
drop policy if exists "Public Read Models" on device_models;
create policy "Public Read Models" on device_models for select using (true);

drop policy if exists "Admins can manage models" on device_models;
create policy "Admins can manage models" on device_models for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- 5. Service Menu Items (For Header Dropdown)
create table if not exists public.service_menu_items (
  id uuid default gen_random_uuid() primary key,
  label text not null,
  route text default '/services',
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.service_menu_items enable row level security;

-- Policies for Service Menu Items
drop policy if exists "Public Read Menu" on service_menu_items;
create policy "Public Read Menu" on service_menu_items for select using (true);

drop policy if exists "Admins can manage menu" on service_menu_items;
create policy "Admins can manage menu" on service_menu_items for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- 6. Repair Services Catalog (For Services Page/Admin)
create table if not exists public.repair_services (
  id uuid default gen_random_uuid() primary key,
  label text not null, -- Service Name
  price text,
  duration text,
  description text,
  image_url text,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.repair_services enable row level security;

-- Policies for Repair Services
drop policy if exists "Public Read Services" on repair_services;
create policy "Public Read Services" on repair_services for select using (true);

drop policy if exists "Admins can manage services" on repair_services;
create policy "Admins can manage services" on repair_services for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));


-- 7. Site Settings (For Global Config like Shop Name, Address, Hours)
create table if not exists public.site_settings (
  key text primary key, -- e.g., 'general', 'services'
  value jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
alter table public.site_settings enable row level security;

-- Policies for Site Settings
drop policy if exists "Public Read Settings" on site_settings;
create policy "Public Read Settings" on site_settings for select using (true);

drop policy if exists "Admins can manage settings" on site_settings;
create policy "Admins can manage settings" on site_settings for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Helper: Function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
