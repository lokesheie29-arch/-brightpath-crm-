import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials exist and are not unedited placeholders
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('your-project-id') &&
  supabaseAnonKey !== 'your-public-anon-key'
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
    console.info('[BrightPath CRM] Supabase client initialized with cloud project URL:', supabaseUrl);
  } catch (err) {
    console.error('[BrightPath CRM] Failed to initialize Supabase client:', err);
  }
} else {
  console.warn(
    '[BrightPath CRM] Supabase credentials not found or using default placeholder. Running in demo mode. Configure .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live persistence.'
  );
}

export const supabase = client;

export function getSupabase(): SupabaseClient {
  if (!client) {
    throw new Error(
      'Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }
  return client;
}
