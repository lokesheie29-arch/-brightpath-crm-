# BrightPath Academy CRM — Supabase Database Setup Guide

This guide explains how to set up the PostgreSQL database, Row Level Security (RLS), and user roles for BrightPath Academy CRM.

---

## 1. Quick Setup via Supabase SQL Editor

1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. Click on **SQL Editor** in the left sidebar.
3. Click **New query**.
4. Open [migrations/20261018000000_initial_schema.sql](file:///d:/bright%20path%20CRM/supabase/migrations/20261018000000_initial_schema.sql), copy its entire content, paste it into the SQL editor, and click **Run**.
5. Verify in **Table Editor** that the 4 tables are created with green **RLS Enabled** badges:
   - `profiles`
   - `leads`
   - `follow_ups`
   - `activities`

---

## 2. User Onboarding & Administrator Promotion

1. In your app or in **Authentication > Users**, create your user account.
2. The trigger `on_auth_user_created` will automatically create a profile for you with the default role `counsellor`.
3. To promote your account to **Administrator**, run this query in the SQL Editor:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE id = (SELECT id FROM auth.users ORDER BY created_at ASC LIMIT 1);
   ```

---

## 3. (Optional) Run Demo Seed Data

Once at least one user is created in the database, run [supabase/seed.sql](file:///d:/bright%20path%20CRM/supabase/seed.sql) in the SQL Editor. It will populate sample student enquiries and follow-ups assigned to your user account.

---

## 4. Safe Database Reset Procedure

If you ever need to reset the workshop database:
```sql
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.follow_ups CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
```
Then re-run `20261018000000_initial_schema.sql`.
