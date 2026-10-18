import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { Profile, UserRole } from '../../types/crm';
import { INITIAL_PROFILES } from '../../mockData';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: UserRole;
  isLoading: boolean;
  isCloudMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  switchDemoProfile: (profile: Profile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(INITIAL_PROFILES[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user profile from Supabase profiles table
  const fetchProfile = async (userId: string) => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('[Auth] Profile fetch warning:', error.message);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.error('[Auth] Failed to fetch profile:', err);
      return null;
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // Demo Workshop Mode: default to Marcus Vance (Counsellor)
      setProfile(INITIAL_PROFILES[0]);
      setIsLoading(false);
      return;
    }

    // 1. Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const userProf = await fetchProfile(session.user.id);
        if (userProf) {
          setProfile(userProf);
        } else {
          // Fallback if trigger hasn't fired yet
          setProfile({
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Staff Member',
            role: 'counsellor'
          });
        }
      }
      setIsLoading(false);
    });

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const userProf = await fetchProfile(session.user.id);
        if (userProf) setProfile(userProf);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      // Demo mode login simulator
      const matched = INITIAL_PROFILES.find(p => p.full_name.toLowerCase().includes(email.toLowerCase().split('@')[0])) || INITIAL_PROFILES[0];
      setProfile(matched);
      return {};
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };

      if (data.user) {
        setUser(data.user);
        const prof = await fetchProfile(data.user.id);
        if (prof) setProfile(prof);
      }
      return {};
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown login error occurred';
      return { error: message };
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: 'Supabase credentials are not yet configured in .env. Please connect Supabase first.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      if (error) return { error: error.message };

      if (data.user) {
        setUser(data.user);
        // Profile will be auto-created by database trigger 'on_auth_user_created'
        const prof = await fetchProfile(data.user.id);
        setProfile(prof || {
          id: data.user.id,
          full_name: fullName,
          role: 'counsellor'
        });
      }
      return {};
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown registration error occurred';
      return { error: message };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(INITIAL_PROFILES[0]);
  };

  const switchDemoProfile = (p: Profile) => {
    setProfile(p);
  };

  const role: UserRole = profile?.role || 'counsellor';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role,
      isLoading,
      isCloudMode: isSupabaseConfigured,
      signIn,
      signUp,
      signOut,
      switchDemoProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
