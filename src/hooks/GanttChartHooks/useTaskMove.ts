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

      // Update in database
      console.log('💾 Updating database...');
      const { data, error: updateError } = await supabase
        .from('kanban_tasks')
        .update({
          started_at: startDateStr,
          due_date: endDateStr,
          updated_at: new Date().toISOString()
        })
        .eq('task_id', id)
        .select();

      if (updateError) {
        console.error('❌ Database error:', updateError);
        throw updateError;
      }

      console.log('✅ Task dates updated successfully:', data);
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