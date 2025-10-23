// lib/supabase/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // This is key - Supabase will auto-detect and process the callback
    flowType: 'pkce',
    // Supabase will store the code verifier with this storage key pattern
    storageKey: `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`,
  },
});