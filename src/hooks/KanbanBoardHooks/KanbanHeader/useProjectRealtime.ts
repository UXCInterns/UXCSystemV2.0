import { useState, useEffect } from 'react';
import { supabase } from '@/../../lib/supabase/supabaseClient';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useProjectRealtime = (projectId: string) => {
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);
  const [liveProgress, setLiveProgress] = useState<number | null>(null);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    console.log('👂 Setting up realtime listener for project progress updates');
    
    const channel = supabase
      .channel(`project-progress:${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          console.log('📊 Project updated via trigger:', payload.new);
          
          const newProgress = payload.new.progress;
          const newStatus = payload.new.status;
          
          if (newProgress !== undefined) {
            setLiveProgress(newProgress);
          }
          if (newStatus !== undefined) {
            setLiveStatus(newStatus);
          }
        }
      )
      .subscribe((status) => {
        console.log(`📡 Project progress realtime status:`, status);
      });

    setRealtimeChannel(channel);

    return () => {
      console.log(`🔌 Unsubscribing from project progress ${projectId}`);
      channel.unsubscribe();
      setRealtimeChannel(null);
    };
  }, [projectId]);

  return { realtimeChannel, liveProgress, liveStatus };
};