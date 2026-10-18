import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Lead, LeadStatus } from '../types/crm';
import { INITIAL_LEADS } from '../mockData';

const LOCAL_STORAGE_KEY = 'brightpath_academy_leads_v1';

function getLocalLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Lead[];
    }
  } catch (err) {
    console.warn('[LeadsService] Error reading localStorage:', err);
  }
  return INITIAL_LEADS;
}

function saveLocalLeads(leads: Lead[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.warn('[LeadsService] Error saving to localStorage:', err);
  }
}

export const leadsService = {
  async fetchLeads(): Promise<{ data: Lead[]; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('[LeadsService] Supabase query error:', error);
          return { data: getLocalLeads(), error: error.message };
        }

        return { data: (data as Lead[]) || [] };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown database error';
        return { data: getLocalLeads(), error: msg };
      }
    }

    // Demo Mode: Local Storage
    return { data: getLocalLeads() };
  },

  async createLead(lead: Lead): Promise<{ data?: Lead; error?: string }> {
    if (isSupabaseConfigured && supabase) {
      try {
        // Strip client-only join fields before inserting into Postgres
        const { assignee, ...leadPayload } = lead;
        const { data, error } = await supabase
          .from('leads')
          .insert(leadPayload)
          .select()
          .single();

        if (error) {
          console.error('[LeadsService] Supabase insert error:', error);
          return { error: error.message };
        }

        return { data: data as Lead };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save lead in database';
        return { error: msg };
      }
    }

    // Demo Mode: update localStorage
    const current = getLocalLeads();
    const updated = [lead, ...current];
    saveLocalLeads(updated);
    return { data: lead };
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<{ error?: string }> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('leads')
          .update({ status, updated_at: now })
          .eq('id', id);

        if (error) {
          return { error: error.message };
        }
        return {};
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update status';
        return { error: msg };
      }
    }

    // Demo Mode: update localStorage
    const current = getLocalLeads();
    const updated = current.map(l => l.id === id ? { ...l, status, updated_at: now } : l);
    saveLocalLeads(updated);
    return {};
  },

  async appendLeadNote(id: string, note: string, authorName: string): Promise<{ updatedNotes?: string; error?: string }> {
    const timestamp = new Date().toLocaleDateString();
    const formattedNote = `• [${timestamp} - ${authorName}]: ${note}`;

    if (isSupabaseConfigured && supabase) {
      try {
        // Fetch current note first
        const { data: currentLead } = await supabase
          .from('leads')
          .select('notes')
          .eq('id', id)
          .single();

        const combinedNotes = currentLead?.notes 
          ? `${currentLead.notes}\n${formattedNote}` 
          : formattedNote;

        const { error } = await supabase
          .from('leads')
          .update({ notes: combinedNotes, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) return { error: error.message };
        return { updatedNotes: combinedNotes };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to append note';
        return { error: msg };
      }
    }

    // Demo Mode: update localStorage
    const current = getLocalLeads();
    let combinedNotes = '';
    const updated = current.map(l => {
      if (l.id === id) {
        combinedNotes = l.notes ? `${l.notes}\n${formattedNote}` : formattedNote;
        return { ...l, notes: combinedNotes, updated_at: new Date().toISOString() };
      }
      return l;
    });
    saveLocalLeads(updated);
    return { updatedNotes: combinedNotes };
  }
};
