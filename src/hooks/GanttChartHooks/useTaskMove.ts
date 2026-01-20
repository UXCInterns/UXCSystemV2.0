import { useCallback } from 'react';
import { supabase } from '@/../../lib/supabase/supabaseClient';
import type { Task } from '@/types/KanbanBoardTypes/kanban';
import { formatDateForStorage } from '@/utils/GanttChartUtils/GanttChartViewUtils/ganttUtils';

export const useTaskMove = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const handleMove = useCallback(async (id: string, startAt: Date, endAt: Date | null) => {
    console.log(`🔄 Task ${id} moved - Start: ${startAt}, End: ${endAt}`);
    
    if (!endAt) {
      console.log('❌ No end date provided');
      return;
    }

    const originalTask = tasks.find(t => t.id === id);
    if (!originalTask) {
      console.log('❌ Task not found');
      return;
    }

    try {
      // ✅ Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('❌ No user found');
        alert('You must be logged in to update tasks');
        return;
      }

      const startDateStr = formatDateForStorage(startAt);
      const endDateStr = formatDateForStorage(endAt);

      // Optimistic update
      console.log('⏳ Applying optimistic update...');
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id
            ? {
                ...task,
                started_at: startDateStr,
                due_date: endDateStr,
                due_date_raw: endDateStr,
                updated_at: new Date().toISOString()
              }
            : task
        )
      );

      // ✅ Update in database using wrapper RPC
      console.log('💾 Updating database with user context...');
      const { error: updateError } = await supabase.rpc('update_task_with_user', {
        p_task_id: id,
        p_task_name: null, // Don't update name
        p_task_description: null, // Don't update description
        p_priority: null, // Don't update priority
        p_due_date: endDateStr,
        p_comments: null, // Don't update comments
        p_user_id: user.id
      });

      if (updateError) {
        console.error('❌ Database error:', updateError);
        throw updateError;
      }

      console.log('✅ Task dates updated successfully by:', user.email);
    } catch (err) {
      console.error('❌ Error updating task dates:', err);
      
      // Revert optimistic update on error
      console.log('↩️ Reverting changes...');
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? originalTask : task
        )
      );
      
      alert('Failed to update task dates. Please try again.');
    }
  }, [tasks, setTasks]);

  return handleMove;
};