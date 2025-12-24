import { supabase } from '@/../../lib/supabase/supabaseClient';
import type { Task } from '@/types/KanbanBoardTypes/kanban';

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
      const { assignee_ids, ...otherUpdates } = updates;

      // Update task fields
      if (Object.keys(otherUpdates).length > 0) {
        const { error } = await supabase
          .from('kanban_tasks')
          .update({
            ...otherUpdates,
            updated_at: new Date().toISOString()
          })
          .eq('task_id', taskId);

        if (error) throw error;
      }

      // Handle assignees if provided (replace all)
      if (assignee_ids !== undefined) {
        // Delete existing assignees
        await supabase
          .from('task_assignees')
          .delete()
          .eq('task_id', taskId);
        
        // Insert new assignees
        if (assignee_ids.length > 0) {
          const { error: assignError } = await supabase
            .from('task_assignees')
            .insert(
              assignee_ids.map(profile_id => ({
                task_id: taskId,
                profile_id: profile_id,
                assigned_at: new Date().toISOString()
              }))
            );

          if (assignError) throw assignError;
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
      const { error } = await supabase
        .from('kanban_tasks')
        .delete()
        .eq('task_id', taskId);

      if (error) throw error;

      // Remove from local state
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));

      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
      return false;
    }
  };

  const handleDragStart = (event: any, dragStartColumnRef: React.MutableRefObject<{ [key: string]: string }>, tasks: Task[]) => {
    const taskId = event.active.id;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      dragStartColumnRef.current[taskId] = task.column;
    }
  };

  const handleDragEnd = async (
    event: any, 
    dragStartColumnRef: React.MutableRefObject<{ [key: string]: string }>,
    tasks: Task[]
  ) => {
    const taskId = event.active.id;
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