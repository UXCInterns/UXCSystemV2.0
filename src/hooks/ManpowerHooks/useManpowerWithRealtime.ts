// Custom hook that fetches manpower data and subscribes to real-time updates
// from projects, core_team, and support_team tables

import { useState, useEffect } from "react";
import { onProjectUpdate } from "@/lib/projectEvents";
import { supabase } from "../../../lib/supabase/supabaseClient";
import { ManpowerRecord } from "@/types/ManpowerTypes/manpower";

export const useManpowerWithRealtime = () => {
  const [manpower, setManpower] = useState<ManpowerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManpower = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/manpower');
      if (!response.ok) throw new Error('Failed to fetch manpower data');
      const data = await response.json();
      setManpower(data.manpower || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching manpower:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManpower();
    
    // Listen for project updates
    const unsubscribe = onProjectUpdate(() => {
      console.log('🔔 Project update event received, refetching manpower...');
      fetchManpower();
    });

    // Listen for realtime changes
    console.log('👂 Setting up realtime listener for manpower changes');
    const channel = supabase
      .channel('manpower-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          console.log('🔔 Projects table changed, refetching manpower...');
          fetchManpower();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_core_team' },
        () => fetchManpower()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_support_team' },
        () => fetchManpower()
      )
      .subscribe((status) => {
        console.log('📡 Manpower realtime status:', status);
      });

    return () => {
      unsubscribe();
      channel.unsubscribe();
    };
  }, []);

  return { manpower, loading, error, refetch: fetchManpower };
};