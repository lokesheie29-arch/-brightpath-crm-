-- ==============================================================================
-- BrightPath Academy CRM — Initial Relational Schema & Row Level Security (RLS)
-- Migration: 20261018000000_initial_schema.sql
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('admin', 'manager', 'counsellor')) default 'counsellor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Security Definer Helper: Fetch current authenticated user's role safely
create or replace function public.current_user_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- 4. Leads Table (Student Enquiries)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text not null,
  course_interest text not null,
  source text not null,
  status text not null check (status in ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')) default 'New',
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Follow-ups Table (Scheduled Calls, Parent Meetings & Tasks)
create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  due_at timestamptz not null,
  note text not null,
  status text not null check (status in ('pending', 'completed', 'cancelled')) default 'pending',
  completed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 6. Activities Table (Audit History Log)
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  activity_type text not null,
  description text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 7. Performance Indexes
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_assigned_to on public.leads(assigned_to);
create index if not exists idx_leads_source on public.leads(source);
create index if not exists idx_leads_created_at on public.leads(created_at desc);

create index if not exists idx_follow_ups_lead_id on public.follow_ups(lead_id);
create index if not exists idx_follow_ups_due_status on public.follow_ups(status, due_at);
create index if not exists idx_follow_ups_assigned_to on public.follow_ups(assigned_to);

create index if not exists idx_activities_lead_id on public.activities(lead_id);
create index if not exists idx_activities_created_at on public.activities(created_at desc);

-- 8. Trigger to Automatically Create Profile on User Signup in auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'counsellor'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all 4 tables
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.follow_ups enable row level security;
alter table public.activities enable row level security;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Anyone authenticated can view profiles (needed to display assigned counsellor names)
drop policy if exists "Authenticated users can read all profiles" on public.profiles;
create policy "Authenticated users can read all profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

-- Users can update their own name, but CANNOT self-escalate their role
drop policy if exists "Users can update their own profile info" on public.profiles;
create policy "Users can update their own profile info"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid() and 
    (role = (select role from public.profiles where id = auth.uid()) or public.current_user_role() = 'admin')
  );

-- Admins can update any profile (including roles)
drop policy if exists "Admins can update all profiles" on public.profiles;
create policy "Admins can update all profiles"
  on public.profiles
  for update
  to authenticated
  using (public.current_user_role() = 'admin');

-- ------------------------------------------------------------------------------
-- LEADS POLICIES
-- ------------------------------------------------------------------------------
-- SELECT: Managers & Admins view all leads; Counsellors view leads assigned to them or created by them
drop policy if exists "Lead access rule" on public.leads;
create policy "Lead access rule"
  on public.leads
  for select
  to authenticated
  using (
    public.current_user_role() in ('admin', 'manager') or
    assigned_to = auth.uid() or
    created_by = auth.uid()
  );

-- INSERT: Authenticated staff can register new student enquiries
drop policy if exists "Authenticated staff can insert leads" on public.leads;
create policy "Authenticated staff can insert leads"
  on public.leads
  for insert
  to authenticated
  with check (auth.uid() is not null);

-- UPDATE: Managers & Admins can update any lead; Counsellors can update their assigned/created leads
drop policy if exists "Lead update rule" on public.leads;
create policy "Lead update rule"
  on public.leads
  for update
  to authenticated
  using (
    public.current_user_role() in ('admin', 'manager') or
    assigned_to = auth.uid() or
    created_by = auth.uid()
  );

-- DELETE: Only Administrators can delete leads
drop policy if exists "Only admins can delete leads" on public.leads;
create policy "Only admins can delete leads"
  on public.leads
  for delete
  to authenticated
  using (public.current_user_role() = 'admin');

-- ------------------------------------------------------------------------------
-- FOLLOW-UPS POLICIES
-- ------------------------------------------------------------------------------
-- Access to follow-up inherits access to the lead
drop policy if exists "Follow-ups select rule" on public.follow_ups;
create policy "Follow-ups select rule"
  on public.follow_ups
  for select
  to authenticated
  using (
    exists (
      select 1 from public.leads l
      where l.id = follow_ups.lead_id and (
        public.current_user_role() in ('admin', 'manager') or
        l.assigned_to = auth.uid() or
        l.created_by = auth.uid()
      )
    )
  );

drop policy if exists "Follow-ups insert rule" on public.follow_ups;
create policy "Follow-ups insert rule"
  on public.follow_ups
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.leads l
      where l.id = follow_ups.lead_id and (
        public.current_user_role() in ('admin', 'manager') or
        l.assigned_to = auth.uid() or
        l.created_by = auth.uid()
      )
    )
  );

drop policy if exists "Follow-ups update rule" on public.follow_ups;
create policy "Follow-ups update rule"
  on public.follow_ups
  for update
  to authenticated
  using (
    exists (
      select 1 from public.leads l
      where l.id = follow_ups.lead_id and (
        public.current_user_role() in ('admin', 'manager') or
        l.assigned_to = auth.uid() or
        l.created_by = auth.uid()
      )
    )
  );

drop policy if exists "Follow-ups delete rule" on public.follow_ups;
create policy "Follow-ups delete rule"
  on public.follow_ups
  for delete
  to authenticated
  using (
    public.current_user_role() in ('admin', 'manager') or
    created_by = auth.uid()
  );

-- ------------------------------------------------------------------------------
-- ACTIVITIES POLICIES
-- ------------------------------------------------------------------------------
-- Activities select rule: Visible if user has access to related lead
drop policy if exists "Activities select rule" on public.activities;
create policy "Activities select rule"
  on public.activities
  for select
  to authenticated
  using (
    exists (
      select 1 from public.leads l
      where l.id = activities.lead_id and (
        public.current_user_role() in ('admin', 'manager') or
        l.assigned_to = auth.uid() or
        l.created_by = auth.uid()
      )
    )
  );

drop policy if exists "Activities insert rule" on public.activities;
create policy "Activities insert rule"
  on public.activities
  for insert
  to authenticated
  with check (auth.uid() is not null);
