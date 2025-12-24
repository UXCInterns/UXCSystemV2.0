import { useState } from "react";
import { supabase } from "../../../../lib/supabase/supabaseClient";

interface TaskFormData {
  task_name: string;
  task_description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  started_at: string;
  due_date: string;
  comments: string;
}

interface UseTaskSubmissionProps {
  projectId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function useTaskSubmission({ projectId, onSuccess, onClose }: UseTaskSubmissionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (formData: TaskFormData): string | null => {
    if (!formData.task_name.trim()) {
      return 'Task name is required';
    }
    if (!formData.started_at) {
      return 'Started date is required';
    }
    if (!formData.due_date) {
      return 'Due date is required';
    }
    return null;
  };

  const submitTask = async (formData: TaskFormData, selectedAssignees: string[]) => {
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📝 Creating task with data:', {
        project_id: projectId,
        task_name: formData.task_name,
        priority: formData.priority,
        started_at: formData.started_at,
        due_date: formData.due_date,
      });

      // Insert task into kanban_tasks table
      const { data: newTask, error: taskError } = await supabase
        .from('kanban_tasks')
        .insert({
          project_id: projectId,
          task_name: formData.task_name,
          task_description: formData.task_description || null,
          status: 'To Do',
          priority: formData.priority,
          started_at: formData.started_at,
          due_date: formData.due_date,
          comments: formData.comments || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('task_id')
        .single();

      if (taskError) {
        console.error('❌ Error creating task:', taskError);
        throw new Error(`Failed to create task: ${taskError.message || taskError.code || JSON.stringify(taskError)}`);
      }

      if (!newTask || !newTask.task_id) {
        console.error('❌ No task returned from insert');
        throw new Error('Failed to create task: No task ID returned');
      }

      console.log('✅ Task created with ID:', newTask.task_id);

      // Insert assignees if any
      if (selectedAssignees.length > 0) {
        console.log('👥 Assigning to:', selectedAssignees);
        
        const { error: assignError } = await supabase
          .from('task_assignees')
          .insert(
            selectedAssignees.map(profile_id => ({
              task_id: newTask.task_id,
              profile_id: profile_id,
              assigned_at: new Date().toISOString()
            }))
          );

        if (assignError) {
          console.error('❌ Error assigning users:', assignError);
          console.warn('Task created but failed to assign users:', assignError.message);
        } else {
          console.log('✅ Assignees added successfully');
        }
      }

      console.log('🎉 Task creation complete');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('💥 Error in submitTask:', err);
      
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        errorMessage = JSON.stringify(err);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, submitTask };
}