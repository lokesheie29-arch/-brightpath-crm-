import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Activity, ActivityType } from '../types/crm';
import { INITIAL_ACTIVITIES } from '../mockData';

const LOCAL_STORAGE_ACTIVITIES_KEY = 'brightpath_academy_activities_v1';

function getLocalActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ACTIVITIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('[ActivitiesService] LocalStorage read warning:', err);
  }
  return INITIAL_ACTIVITIES;
}

function saveLocalActivities(acts: Activity[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_ACTIVITIES_KEY, JSON.stringify(acts));
  } catch (err) {
    console.warn('[ActivitiesService] LocalStorage save warning:', err);
  }
}

export const activitiesService = {
  async fetchActivities(): Promise<Activity[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('[ActivitiesService] Supabase fetch error:', error);
          return getLocalActivities();
        }
        return (data as Activity[]) || [];
      } catch (err) {
        console.error('[ActivitiesService] Exception fetching activities:', err);
        return getLocalActivities();
      }
    }
    return getLocalActivities();
  },

  async recordActivity(
    leadId: string,
    actorId: string | null,
    actorName: string,
    type: ActivityType,
    description: string,
    metadata: Record<string, unknown> = {}
  ): Promise<Activity> {
    const now = new Date().toISOString();
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      lead_id: leadId,
      actor_id: actorId,
      activity_type: type,
      description,
      metadata,
      created_at: now,
      actor_name: actorName
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { actor_name, ...payload } = newActivity;
        await supabase.from('activities').insert(payload);
      } catch (err) {
        console.warn('[ActivitiesService] Failed to record in Supabase:', err);
      }
    }

    const current = getLocalActivities();
    const updated = [newActivity, ...current];
    saveLocalActivities(updated);
    return newActivity;
  }
};
