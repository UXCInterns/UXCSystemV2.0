import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../lib/supabase/supabaseClient';
import type { Task } from '@/types/KanbanBoardTypes/kanban';

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch tasks directly from Supabase using the view
  const fetchTasks = useCallback(async (silent = false) => {
    try {
      // Prevent too frequent fetches (debounce) - but allow bypass on visibility change
      const now = Date.now();
      if (silent && now - lastFetchRef.current < 500) {
        return;
      }
      lastFetchRef.current = now;

      if (!silent) {
        setLoading(true);
      }
      
      const { data, error: fetchError } = await supabase
        .from('task_details')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedTasks = (data || []).map((task: any) => ({
        ...task,
        id: task.task_id,
        column: task.status,
        name: task.task_name,
      }));

      setTasks(transformedTasks);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [projectId]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Polling every 10 seconds when tab is visible (like Notion)
  useEffect(() => {
    const startPolling = () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      pollingIntervalRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          console.log('🔄 Polling for updates...');
          fetchTasks(true); // Silent fetch
        }
      }, 8000); // Poll every 8 seconds (slightly more aggressive)
    };

    startPolling();

    // Refresh immediately when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👀 Tab visible, refreshing...');
        window.location.reload();
        // Force immediate fetch without debounce
        lastFetchRef.current = 0;
        fetchTasks(true);
        startPolling(); // Restart polling
      } else {
        // Stop polling when tab is hidden to save resources
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchTasks]);

  // Update task status with optimistic update
  const updateTaskStatus = async (
    taskId: string,
    newStatus: string,
    previousStatus: string
  ): Promise<boolean> => {
    // Optimistic update - immediate UI change
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === taskId 
          ? { ...t, column: newStatus as Task['status'], status: newStatus as Task['status'], updated_at: new Date().toISOString() } 
          : t
      )
    );

    try {
      const { error } = await supabase
        .from('kanban_tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('task_id', taskId);

      if (error) throw error;

      // Silent background refresh to sync any other changes
      setTimeout(() => fetchTasks(true), 500);

      return true;
    } catch (err) {
      console.error('Error updating task status:', err);
      
      // Revert on error
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId 
            ? { ...t, column: previousStatus as Task['status'], status: previousStatus as Task['status'] } 
            : t
        )
      );
      
      alert('Failed to update task. Please try again.');
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks: () => fetchTasks(false),
    updateTaskStatus,
    setTasks,
    isRealtimeConnected: true, // Always "connected" with polling
  };
}