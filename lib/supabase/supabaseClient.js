// lib/supabase/supabaseClient.js
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
    // IMPROVED: Better reconnection settings
    heartbeatIntervalMs: 30000, // Send heartbeat every 30 seconds
    timeout: 20000, // Wait 20 seconds before timing out
    // Reconnect settings
    reconnectAfterMs: (tries) => {
      // Exponential backoff: 1s, 2s, 4s, 8s, max 10s
      return Math.min(1000 * Math.pow(2, tries), 10000);
    },
  },
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        // Increased timeout for better stability
        signal: AbortSignal.timeout(15000), // 15 second timeout
        // Add keep-alive header to maintain connections
        keepalive: true,
      });
    },
  },
  // IMPROVED: More resilient settings
  db: {
    schema: 'public',
  },
  // Add connection pooling hints
  global: {
    headers: {
      'x-connection-type': 'realtime',
    },
  },
});

// Add listener for connection state changes (optional - for debugging)
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('🌐 Network back online');
  });

  window.addEventListener('offline', () => {
    console.warn('📡 Network offline');
  });
}