export type UserRole = 'admin' | 'manager' | 'counsellor';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export type LeadSource = 
  | 'Website' 
  | 'Walk-in' 
  | 'Referral' 
  | 'Phone Call' 
  | 'Social Media' 
  | 'School Partner';

export type CourseInterest = 
  | 'SAT Prep Masterclass' 
  | 'IIT-JEE Foundation' 
  | 'Advanced Mathematics' 
  | 'Physics & Chemistry Core' 
  | 'Medical NEET Bridge'
  | 'General High School Honors';

export interface Lead {
  id: string;
  full_name: string;
  email?: string | null;
  phone: string;
  course_interest: string;
  source: string;
  status: LeadStatus;
  assigned_to?: string | null;
  created_by?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined or client enriched
  assignee?: Profile | null;
}

export type FollowUpStatus = 'pending' | 'completed' | 'cancelled';

export interface FollowUp {
  id: string;
  lead_id: string;
  assigned_to?: string | null;
  due_at: string;
  note: string;
  status: FollowUpStatus;
  completed_at?: string | null;
  created_by?: string | null;
  created_at: string;
  // Joined or client enriched
  lead_name?: string;
  assignee_name?: string;
}

export type ActivityType = 
  | 'lead_created' 
  | 'status_changed' 
  | 'note_added' 
  | 'follow_up_scheduled' 
  | 'follow_up_completed';

export interface Activity {
  id: string;
  lead_id: string;
  actor_id?: string | null;
  activity_type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  actor_name?: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  overdueFollowUps: number;
  upcomingFollowUps: number;
}
