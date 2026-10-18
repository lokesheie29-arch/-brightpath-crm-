-- ==============================================================================
-- BrightPath Academy CRM — Optional Demo Seed Data
-- Run this AFTER creating at least one user in Supabase Auth & running initial_schema.sql
-- ==============================================================================

do $$
declare
  first_profile_id uuid;
begin
  -- Find the first profile in the database
  select id into first_profile_id from public.profiles limit 1;

  if first_profile_id is null then
    raise notice 'No profile found yet. Please sign up at least one user first before seeding demo leads.';
  else
    -- Insert Sample Student Enquiries
    insert into public.leads (id, full_name, email, phone, course_interest, source, status, assigned_to, created_by, notes)
    values
      (
        '11111111-1111-1111-1111-111111111111',
        'Rohan Sharma',
        'rohan.sharma@gmail.com',
        '+1 (555) 234-8901',
        'SAT Prep Masterclass',
        'Website',
        'Qualified',
        first_profile_id,
        first_profile_id,
        'Scored 1320 on baseline diagnostic. Aiming for 1500+ for early admissions. Parents attended info webinar.'
      ),
      (
        '22222222-2222-2222-2222-222222222222',
        'Ananya Iyer',
        'ananya.iyer@outlook.com',
        '+1 (555) 456-7890',
        'IIT-JEE Foundation',
        'Referral',
        'Contacted',
        first_profile_id,
        first_profile_id,
        'Grade 10 student. Inquired about weekend batch timing and physics faculty credentials.'
      ),
      (
        '33333333-3333-3333-3333-333333333333',
        'Arjun Patel',
        'arjun.patel@gmail.com',
        '+1 (555) 789-0123',
        'Physics & Chemistry Core',
        'Walk-in',
        'Converted',
        first_profile_id,
        first_profile_id,
        'Admission confirmed! Enrolled into Morning Intensive Track. Seat allocated.'
      ),
      (
        '44444444-4444-4444-4444-444444444444',
        'Kavita Nair',
        'kavita.nair@icloud.com',
        '+1 (555) 321-6547',
        'Advanced Mathematics',
        'School Partner',
        'New',
        first_profile_id,
        first_profile_id,
        'Nominated through STEM school outreach program. Needs diagnostic assessment link.'
      )
    on conflict (id) do nothing;

    -- Insert Sample Follow-ups
    insert into public.follow_ups (lead_id, assigned_to, due_at, note, status, created_by)
    values
      (
        '11111111-1111-1111-1111-111111111111',
        first_profile_id,
        now() + interval '2 hours',
        'Conduct diagnostic score analysis with parents and review SAT batch schedule',
        'pending',
        first_profile_id
      ),
      (
        '22222222-2222-2222-2222-222222222222',
        first_profile_id,
        now() + interval '1 day',
        'Share Physics demo class link and faculty profile brochure',
        'pending',
        first_profile_id
      ),
      (
        '44444444-4444-4444-4444-444444444444',
        first_profile_id,
        now() - interval '1 day', -- Overdue
        'Call school coordinator to verify STEM scholarship nomination eligibility',
        'pending',
        first_profile_id
      )
    on conflict do nothing;

    raise notice 'Successfully seeded demo leads and follow-ups!';
  end if;
end $$;
