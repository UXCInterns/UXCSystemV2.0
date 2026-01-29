import { supabase } from '../../../../lib/supabase/supabaseClient';
import type { Task } from '@/types/KanbanBoardTypes/kanban';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';

interface UseTaskOperationsProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  updateTaskStatus: (taskId: string, newStatus: Task['status'], oldStatus: Task['status']) => Promise<boolean>;
}

export function useTaskOperations({
  setTasks,
  selectedTask,
  setSelectedTask,
  updateTaskStatus
}: UseTaskOperationsProps) {
  
  const handleUpdateTask = async (
    taskId: string, 
    updates: Partial<Task> & { assignee_ids?: string[] }
  ): Promise<boolean> => {
    try {
      // ✅ Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in to update tasks');
        return false;
      }

      const { assignee_ids, ...otherUpdates } = updates;

      // ✅ Update task fields using wrapper function
      if (Object.keys(otherUpdates).length > 0) {
        const { error } = await supabase.rpc('update_task_with_user', {
          p_task_id: taskId,
          p_task_name: otherUpdates.task_name || null,
          p_task_description: otherUpdates.task_description || null,
          p_priority: otherUpdates.priority || null,
          p_started_at: otherUpdates.started_at || null,
          p_due_date: otherUpdates.due_date || null,
          p_comments: otherUpdates.comments || null,
          p_user_id: user.id
        });

        if (error) throw error;
      }

      // ✅ Handle assignees if provided (replace all)
      if (assignee_ids !== undefined) {
        // Get current assignees
        const { data: currentAssignees } = await supabase
          .from('task_assignees')
          .select('profile_id')
          .eq('task_id', taskId);

        const currentIds = currentAssignees?.map(a => a.profile_id) || [];
        const toAdd = assignee_ids.filter(id => !currentIds.includes(id));
        const toRemove = currentIds.filter(id => !assignee_ids.includes(id));

        // Remove assignees
        for (const profileId of toRemove) {
          await supabase.rpc('unassign_task_with_user', {
            p_task_id: taskId,
            p_profile_id: profileId,
            p_user_id: user.id
          });
        }

        // Add new assignees
        for (const profileId of toAdd) {
          await supabase.rpc('assign_task_with_user', {
            p_task_id: taskId,
            p_profile_id: profileId,
            p_assigned_by: user.id,
            p_user_id: user.id
          });
        }
      }

      // Fetch updated task to get all the latest data
      const { data: updatedTask, error: fetchError } = await supabase
        .from('task_details')
        .select('*')
        .eq('task_id', taskId)
        .single();

      if (fetchError) throw fetchError;

      // Update local state
      const transformed = {
        ...updatedTask,
        id: updatedTask.task_id,
        column: updatedTask.status,
        name: updatedTask.task_name,
      };

      setTasks(prevTasks =>
        prevTasks.map(t => t.id === taskId ? transformed : t)
      );

      if (selectedTask?.id === taskId) {
        setSelectedTask(transformed);
      }

      return true;
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task. Please try again.');
      return false;
    }
  };

const handleDeleteTask = async (taskId: string): Promise<boolean> => {
  try {
    console.log('🗑️ Starting delete for task:', taskId);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      alert('Authentication error');
      return false;
    }
    
    if (!user) {
      console.error('❌ No user found');
      alert('You must be logged in to delete tasks');
      return false;
    }

    console.log('👤 User ID:', user.id);
    console.log('📋 Calling RPC with params:', { p_task_id: taskId, p_user_id: user.id });

    const { data, error } = await supabase.rpc('delete_task_with_user', {
      p_task_id: taskId,
      p_user_id: user.id
    });

    console.log('📡 RPC Response:', { data, error });

    if (error) {
      console.error('❌ Supabase RPC error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: JSON.stringify(error, null, 2)
      });
      throw error;
    }

    console.log('✅ Delete successful');
    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    return true;
    
  } catch (err) {
    console.error('💥 Caught error:', err);
    console.error('Error type:', typeof err);
    console.error('Error constructor:', err?.constructor?.name);
    console.error('Error keys:', Object.keys(err || {}));
    
    alert(`Failed to delete task: ${err instanceof Error ? err.message : JSON.stringify(err)}`);
    return false;
  }
};

  const handleDragStart = (
    event: DragStartEvent, 
    dragStartColumnRef: React.MutableRefObject<{ [key: string]: string }>, 
    tasks: Task[]
  ) => {
    const taskId = event.active.id as string;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      dragStartColumnRef.current[taskId] = task.column;
    }
  };

  const handleDragEnd = async (
    event: DragEndEvent, 
    dragStartColumnRef: React.MutableRefObject<{ [key: string]: string }>,
    tasks: Task[]
  ) => {
    const taskId = event.active.id as string;
    const task = tasks.find(t => t.id === taskId);
    
    if (task && dragStartColumnRef.current[taskId]) {
      const startColumn = dragStartColumnRef.current[taskId];
      const endColumn = task.column;
      
      if (startColumn !== endColumn) {
        const success = await updateTaskStatus(
          taskId, 
          endColumn as Task['status'], 
          startColumn as Task['status']
        );
        
        if (success && selectedTask?.id === taskId) {
          setSelectedTask({ ...task, status: endColumn as Task['status'] });
        }
      }
      
      delete dragStartColumnRef.current[taskId];
    }
  };

  return {
    handleUpdateTask,
    handleDeleteTask,
    handleDragStart,
    handleDragEnd
  };
}