-- BeeKeeper Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard > SQL Editor)

-- ============================================================
-- 1. Create ALL tables first (no policies yet, avoids ordering issues)
-- ============================================================

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  created_at timestamptz default now()
);

-- Hives
create table public.hives (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  location text default '',
  type text not null default 'Langstroth',
  date_established date not null default current_date,
  notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Hive Shares (user-to-user sharing) — must exist before policies reference it
create table public.hive_shares (
  id uuid default gen_random_uuid() primary key,
  hive_id uuid references public.hives on delete cascade not null,
  owner_id uuid references auth.users on delete cascade not null,
  shared_with_id uuid references auth.users on delete cascade not null,
  permission text not null default 'view',
  created_at timestamptz default now(),
  unique(hive_id, shared_with_id)
);

-- Inspections
create table public.inspections (
  id uuid default gen_random_uuid() primary key,
  hive_id uuid references public.hives on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  date date not null default current_date,
  queen_spotted boolean default false,
  brood_pattern text not null default 'Good',
  temperament text not null default 'Calm',
  honey_stores text not null default 'Adequate',
  pests_and_diseases text[] default '{}',
  weather_condition text not null default 'Sunny',
  weather_temperature_f integer default 75,
  notes text default '',
  health_score integer not null default 5,
  created_at timestamptz default now()
);

-- Tasks
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  hive_id uuid references public.hives on delete cascade,
  title text not null,
  description text default '',
  due_date date not null default current_date,
  completed boolean default false,
  recurring text not null default 'none',
  created_at timestamptz default now()
);

-- ============================================================
-- 2. Enable RLS on all tables
-- ============================================================

alter table public.profiles enable row level security;
alter table public.hives enable row level security;
alter table public.hive_shares enable row level security;
alter table public.inspections enable row level security;
alter table public.tasks enable row level security;

-- ============================================================
-- 3. Policies — all tables exist, safe to reference hive_shares
-- ============================================================

-- Profiles policies
create policy "Users can view any profile"
  on public.profiles for select
  to authenticated using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated using (auth.uid() = id);

-- Hives policies
create policy "Users can view own hives"
  on public.hives for select
  to authenticated using (user_id = auth.uid());

create policy "Users can view shared hives"
  on public.hives for select
  to authenticated
  using (
    id in (select hive_id from public.hive_shares where shared_with_id = auth.uid())
  );

create policy "Users can insert own hives"
  on public.hives for insert
  to authenticated with check (user_id = auth.uid());

create policy "Users can update own hives"
  on public.hives for update
  to authenticated using (user_id = auth.uid());

create policy "Users can delete own hives"
  on public.hives for delete
  to authenticated using (user_id = auth.uid());

-- Hive Shares policies
create policy "Owners can view shares for their hives"
  on public.hive_shares for select
  to authenticated using (owner_id = auth.uid());

create policy "Shared users can view their shares"
  on public.hive_shares for select
  to authenticated using (shared_with_id = auth.uid());

create policy "Owners can create shares"
  on public.hive_shares for insert
  to authenticated with check (owner_id = auth.uid());

create policy "Owners can delete shares"
  on public.hive_shares for delete
  to authenticated using (owner_id = auth.uid());

-- Inspections policies
create policy "Users can view inspections for own hives"
  on public.inspections for select
  to authenticated using (user_id = auth.uid());

create policy "Users can view inspections for shared hives"
  on public.inspections for select
  to authenticated
  using (
    hive_id in (select hive_id from public.hive_shares where shared_with_id = auth.uid())
  );

create policy "Users can insert inspections for own hives"
  on public.inspections for insert
  to authenticated with check (user_id = auth.uid());

create policy "Users can update own inspections"
  on public.inspections for update
  to authenticated using (user_id = auth.uid());

create policy "Users can delete own inspections"
  on public.inspections for delete
  to authenticated using (user_id = auth.uid());

-- Tasks policies
create policy "Users can view own tasks"
  on public.tasks for select
  to authenticated using (user_id = auth.uid());

create policy "Users can insert own tasks"
  on public.tasks for insert
  to authenticated with check (user_id = auth.uid());

create policy "Users can update own tasks"
  on public.tasks for update
  to authenticated using (user_id = auth.uid());

create policy "Users can delete own tasks"
  on public.tasks for delete
  to authenticated using (user_id = auth.uid());

-- ============================================================
-- 4. Auto-create profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- 5. Indexes
-- ============================================================

create index idx_hives_user_id on public.hives(user_id);
create index idx_inspections_hive_id on public.inspections(hive_id);
create index idx_inspections_user_id on public.inspections(user_id);
create index idx_tasks_user_id on public.tasks(user_id);
create index idx_hive_shares_shared_with on public.hive_shares(shared_with_id);
create index idx_hive_shares_hive_id on public.hive_shares(hive_id);
