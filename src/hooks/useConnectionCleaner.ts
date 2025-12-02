// hooks/useConnectionCleaner.ts
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase/supabaseClient';

/**
 * Hook to clean up any stuck Supabase connections when component unmounts
 * This prevents the "keeps loading" issue when switching tabs
 */
export function useConnectionCleaner() {
  useEffect(() => {
    return () => {
      // Clean up all realtime channels on unmount
      const channels = supabase.getChannels();
      console.log(`🧹 Cleaning up ${channels.length} Supabase channels`);
      
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, []);
}

// Alternative: Force clean all channels manually
export async function forceCleanConnections() {
  const channels = supabase.getChannels();
  console.log(`🧹 Force cleaning ${channels.length} channels`);
  
  for (const channel of channels) {
    await supabase.removeChannel(channel);
  }
  
  console.log('✅ All connections cleaned');
}