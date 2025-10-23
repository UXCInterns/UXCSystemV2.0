'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
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
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/signin', '/signup', '/reset-password'];

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
        console.error('❌ Error fetching profile:', error);
        return null;
      }

      console.log('✅ Profile fetched:', data);
      return data;
    } catch (err) {
      console.error('❌ Unexpected error fetching profile:', err);
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

  const handleSignOut = useCallback(async () => {
    // Prevent multiple simultaneous sign-out attempts
    if (isSigningOutRef.current) {
      console.log('⚠️ Sign out already in progress');
      return;
    }

    console.log('🚪 Instant sign out...');
    isSigningOutRef.current = true;
    
    // Clear inactivity timer immediately
    clearInactivityTimer();
    
    // Clear local state immediately
    setUser(null);
    setSession(null);
    setProfile(null);

    // Clear storage immediately
    localStorage.clear();
    sessionStorage.clear();
    
    console.log('✅ Local state and storage cleared');
    
    // Call Supabase signOut in background (don't wait for it)
    supabase.auth.signOut().then(() => {
      console.log('✅ Supabase signOut completed (background)');
    }).catch((error) => {
      console.warn('⚠️ Supabase signOut failed (background):', error);
    });
    
    // Immediate redirect - don't wait for Supabase
    console.log('🔀 Redirecting immediately to /signin...');
    router.replace('/signin');

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
      console.log('⏱️ User inactive for 15 minutes, logging out...');
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

    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));
    
    // Check if this is an OAuth callback (has code parameter)
    const isOAuthCallback = pathname === '/home' && typeof window !== 'undefined' && 
      new URLSearchParams(window.location.search).has('code');

    // If not authenticated and not on a public route and not OAuth callback
    if (!user && !isPublicRoute && !isOAuthCallback) {
      console.log('❌ Not authenticated, redirecting to /signin');
      router.replace('/signin');
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initialized.current) return;
    initialized.current = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('✅ Session loaded:', session.user.email);
          // Fetch profile data
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        }
      } catch (error) {
        console.error('❌ Unexpected error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔍 Auth event:', event);
      
      // Handle sign out event
      if (event === 'SIGNED_OUT') {
        console.log('👋 SIGNED_OUT event received');
        
        // Clear inactivity timer
        clearInactivityTimer();
        
        // Clear state
        setSession(null);
        setUser(null);
        setProfile(null);
        
        // Don't redirect here - handleSignOut already handles it
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
        console.log('✅ User signed in:', session.user.email);
        // Reset signing out flag on new sign in
        isSigningOutRef.current = false;
        // Fetch profile data on sign in
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clearInactivityTimer, router]);

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