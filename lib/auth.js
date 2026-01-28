import { supabase } from './supabaseClient';

// Sign out user and redirect to sign-in page
// Supabase automatically clears the session from localStorage
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
    window.location.href = '/signin';
  } catch (err) {
    console.error('Unexpected sign out error:', err);
    window.location.href = '/signin';
  }
}

// Get current session
// Returns null if no active session
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return data.session;
  } catch (err) {
    console.error('Unexpected error getting session:', err);
    return null;
  }
}

// Get current user
// Returns null if not authenticated
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    return data.user;
  } catch (err) {
    console.error('Unexpected error getting user:', err);
    return null;
  }
}

// Refresh the current session
// Supabase handles this automatically, but you can call it manually if needed
export async function refreshSession() {
  try {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
    console.log('✅ Session refreshed successfully');
    return true;
  } catch (err) {
    console.error('Unexpected error refreshing session:', err);
    return false;
  }
}