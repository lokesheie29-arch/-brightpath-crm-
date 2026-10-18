import { Lead, Profile, FollowUp, Activity, UserRole } from './types/crm';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'prof-1',
    full_name: 'Marcus Vance',
    role: 'counsellor',
    created_at: '2026-09-01T08:00:00Z',
    updated_at: '2026-09-01T08:00:00Z'
  },
  {
    id: 'prof-2',
    full_name: 'Sarah Miller',
    role: 'counsellor',
    created_at: '2026-09-01T08:00:00Z',
    updated_at: '2026-09-01T08:00:00Z'
  },
  {
    id: 'prof-3',
    full_name: 'Elena Gomez',
    role: 'manager',
    created_at: '2026-08-15T08:00:00Z',
    updated_at: '2026-08-15T08:00:00Z'
  },
  {
    id: 'prof-4',
    full_name: 'Dr. Arthur Pendelton',
    role: 'admin',
    created_at: '2026-08-01T08:00:00Z',
    updated_at: '2026-08-01T08:00:00Z'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    full_name: 'Rohan Sharma',
    email: 'rohan.sharma@gmail.com',
    phone: '+1 (555) 234-8901',
    course_interest: 'SAT Prep Masterclass',
    source: 'Website',
    status: 'Qualified',
    assigned_to: 'prof-1',
    created_by: 'prof-1',
    notes: 'Scored 1320 on baseline diagnostic. Aiming for 1500+ for early admissions. Parents attended info webinar.',
    created_at: '2026-10-12T10:30:00Z',
    updated_at: '2026-10-15T14:20:00Z'
  },
  {
    id: 'lead-2',
    full_name: 'Ananya Iyer',
    email: 'ananya.iyer@outlook.com',
    phone: '+1 (555) 456-7890',
    course_interest: 'IIT-JEE Foundation',
    source: 'Referral',
    status: 'Contacted',
    assigned_to: 'prof-2',
    created_by: 'prof-2',
    notes: 'Grade 10 student. Inquired about weekend batch timing and physics faculty credentials.',
    created_at: '2026-10-14T09:15:00Z',
    updated_at: '2026-10-16T11:00:00Z'
  },
  {
    id: 'lead-3',
    full_name: 'Arjun Patel',
    email: 'arjun.patel@gmail.com',
    phone: '+1 (555) 789-0123',
    course_interest: 'Physics & Chemistry Core',
    source: 'Walk-in',
    status: 'Converted',
    assigned_to: 'prof-1',
    created_by: 'prof-3',
    notes: 'Admission confirmed! Enrolled into Morning Intensive Track. Seat allocated.',
    created_at: '2026-10-08T11:00:00Z',
    updated_at: '2026-10-17T16:30:00Z'
  },
  {
    id: 'lead-4',
    full_name: 'Kavita Nair',
    email: 'kavita.nair@icloud.com',
    phone: '+1 (555) 321-6547',
    course_interest: 'Advanced Mathematics',
    source: 'School Partner',
    status: 'New',
    assigned_to: 'prof-1',
    created_by: 'prof-1',
    notes: 'Nominated through STEM school outreach program. Needs diagnostic assessment link.',
    created_at: '2026-10-18T08:45:00Z',
    updated_at: '2026-10-18T08:45:00Z'
  },
  {
    id: 'lead-5',
    full_name: 'Priya Desai',
    email: 'priya.desai@yahoo.com',
    phone: '+1 (555) 654-9870',
    course_interest: 'Medical NEET Bridge',
    source: 'Social Media',
    status: 'Lost',
    assigned_to: 'prof-2',
    created_by: 'prof-2',
    notes: 'Family relocating out of state for the upcoming academic cycle.',
    created_at: '2026-10-05T14:10:00Z',
    updated_at: '2026-10-11T12:00:00Z'
  },
  {
    id: 'lead-6',
    full_name: 'Liam O\'Connor',
    email: 'liam.oc@gmail.com',
    phone: '+1 (555) 987-1234',
    course_interest: 'SAT Prep Masterclass',
    source: 'Phone Call',
    status: 'Qualified',
    assigned_to: 'prof-1',
    created_by: 'prof-1',
    notes: 'Targeting Ivy League engineering. Wants 1-on-1 Math coaching module supplement.',
    created_at: '2026-10-16T15:20:00Z',
    updated_at: '2026-10-17T09:40:00Z'
  }
];

export const INITIAL_FOLLOW_UPS: FollowUp[] = [
  {
    id: 'fu-1',
    lead_id: 'lead-1',
    assigned_to: 'prof-1',
    due_at: '2026-10-18T16:00:00Z',
    note: 'Conduct diagnostic score analysis with parents and review SAT batch schedule',
    status: 'pending',
    completed_at: null,
    created_by: 'prof-1',
    created_at: '2026-10-15T14:20:00Z',
    lead_name: 'Rohan Sharma',
    assignee_name: 'Marcus Vance'
  },
  {
    id: 'fu-2',
    lead_id: 'lead-2',
    assigned_to: 'prof-2',
    due_at: '2026-10-19T10:30:00Z',
    note: 'Share Physics demo class link and faculty profile brochure',
    status: 'pending',
    completed_at: null,
    created_by: 'prof-2',
    created_at: '2026-10-16T11:00:00Z',
    lead_name: 'Ananya Iyer',
    assignee_name: 'Sarah Miller'
  },
  {
    id: 'fu-3',
    lead_id: 'lead-4',
    assigned_to: 'prof-1',
    due_at: '2026-10-17T11:00:00Z', // Overdue (before now)
    note: 'Call school coordinator to verify STEM scholarship nomination eligibility',
    status: 'pending',
    completed_at: null,
    created_by: 'prof-1',
    created_at: '2026-10-15T09:00:00Z',
    lead_name: 'Kavita Nair',
    assignee_name: 'Marcus Vance'
  },
  {
    id: 'fu-4',
    lead_id: 'lead-3',
    assigned_to: 'prof-1',
    due_at: '2026-10-17T14:00:00Z',
    note: 'Send welcome packet and laboratory safety clearance form',
    status: 'completed',
    completed_at: '2026-10-17T16:30:00Z',
    created_by: 'prof-1',
    created_at: '2026-10-16T10:00:00Z',
    lead_name: 'Arjun Patel',
    assignee_name: 'Marcus Vance'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    lead_id: 'lead-3',
    actor_id: 'prof-1',
    activity_type: 'status_changed',
    description: 'Enrolment completed: status advanced to Converted.',
    metadata: { previous: 'Qualified', new: 'Converted' },
    created_at: '2026-10-17T16:30:00Z',
    actor_name: 'Marcus Vance'
  },
  {
    id: 'act-2',
    lead_id: 'lead-1',
    actor_id: 'prof-1',
    activity_type: 'note_added',
    description: 'Diagnostic assessment report received (Math: 720, Verbal: 600).',
    created_at: '2026-10-15T14:20:00Z',
    actor_name: 'Marcus Vance'
  },
  {
    id: 'act-3',
    lead_id: 'lead-4',
    actor_id: 'prof-1',
    activity_type: 'lead_created',
    description: 'Enquiry registered via School Partner Outreach.',
    created_at: '2026-10-18T08:45:00Z',
    actor_name: 'Marcus Vance'
  }
];

export const COURSE_OPTIONS = [
  'SAT Prep Masterclass',
  'IIT-JEE Foundation',
  'Advanced Mathematics',
  'Physics & Chemistry Core',
  'Medical NEET Bridge',
  'General High School Honors'
];

export const SOURCE_OPTIONS = [
  'Website',
  'Walk-in',
  'Referral',
  'Phone Call',
  'Social Media',
  'School Partner'
];

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  New: { label: 'New Enquiry', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
  Contacted: { label: 'Contacted', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.12)' },
  Qualified: { label: 'Qualified', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  Converted: { label: 'Enrolled (Converted)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
  Lost: { label: 'Lost / Closed', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.12)' }
};
