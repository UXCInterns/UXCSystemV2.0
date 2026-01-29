'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  first_name: string | null;
  last_name: string | null;
  birthday: string | null;
  banner_url: string | null;
  role: string | null;
  bio: string | null;
  job_title: string | null;
  date_joined: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  is_active: boolean | null;
  twitter_url: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inactivity timeout in milliseconds (15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/signin', '/participant', '/participant/takeSurvey'];


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const isSigningOutRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch profile data from the profiles table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (err) {
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Clear inactivity timer helper
  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  // Sign out handler
  const handleSignOut = useCallback(async () => {
    // Prevent multiple simultaneous sign-out attempts
    if (isSigningOutRef.current) {
      return;
    }

    isSigningOutRef.current = true;
    
    // Clear inactivity timer immediately
    clearInactivityTimer();
    
    // Clear local state immediately
    setUser(null);
    setSession(null);
    setProfile(null);

    // Only clear Supabase-specific keys from localStorage
    try {
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || key.includes('supabase')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      // localStorage might not be available
    }
    
    // Call Supabase signOut in background (don't block on it)
    supabase.auth.signOut().catch(() => {
      // Ignore errors, we're signing out anyway
    });
    
    // Immediate redirect
    router.replace('/signin');
    
    // Reset flag after a short delay
    setTimeout(() => {
      isSigningOutRef.current = false;
    }, 500);
  }, [clearInactivityTimer, router]);

  // Reset inactivity timer
  const resetInactivityTimer = useCallback(() => {
    // Don't set timer if signing out or no user
    if (isSigningOutRef.current || !user) {
      return;
    }

    lastActivityRef.current = Date.now();
    
    // Clear existing timer
    clearInactivityTimer();
    
    // Set new timer
    inactivityTimerRef.current = setTimeout(() => {
      handleSignOut();
    }, INACTIVITY_TIMEOUT);
  }, [user, handleSignOut, clearInactivityTimer]);

  // Track user activity
  useEffect(() => {
    if (!user || isSigningOutRef.current) return;

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Throttle activity detection to avoid excessive timer resets
    let throttleTimeout: NodeJS.Timeout | null = null;
    
    const handleActivity = () => {
      if (throttleTimeout || isSigningOutRef.current) return;
      
      throttleTimeout = setTimeout(() => {
        resetInactivityTimer();
        throttleTimeout = null;
      }, 1000); // Throttle to once per second
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timer
    resetInactivityTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
      clearInactivityTimer();
    };
  }, [user, resetInactivityTimer, clearInactivityTimer]);

  // Protect routes - redirect to signin if not authenticated
  useEffect(() => {
    // Don't redirect if still loading or if signing out
    if (loading || isSigningOutRef.current) return;

    // Check if current route is public or auth callback
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));
    const isAuthCallback = pathname?.startsWith('/auth/callback');

    // If not authenticated and not on a public route and not OAuth callback
    if (!user && !isPublicRoute && !isAuthCallback) {
      router.replace('/signin');
    }
  }, [user, loading, pathname, router]);

  // Initialize auth and listen for changes
  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initialized.current) return;
    initialized.current = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        }
      } catch (error) {
        // Initialization failed
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      // Handle sign out event
      if (event === 'SIGNED_OUT') {
        clearInactivityTimer();
        setSession(null);
        setUser(null);
        setProfile(null);
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Only set loading false for initial session
      if (event === 'INITIAL_SESSION') {
        setLoading(false);
      }

      // Handle sign in
      if (event === 'SIGNED_IN' && session?.user) {
        // Reset signing out flag on new sign in
        isSigningOutRef.current = false;
        // Fetch profile data on sign in
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }
    });

    return () => {
      subscription.unsubscribe();
      initialized.current = false;
    };
  }, [clearInactivityTimer]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}