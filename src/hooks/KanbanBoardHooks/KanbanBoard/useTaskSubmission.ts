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
      // ✅ Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to create tasks');
        setLoading(false);
        return;
      }

      console.log('📝 Creating task with data:', {
        project_id: projectId,
        task_name: formData.task_name,
        priority: formData.priority,
        started_at: formData.started_at,
        due_date: formData.due_date,
      });

      // ✅ Use wrapper RPC function to create task
      const { data: newTaskId, error: taskError } = await supabase.rpc('create_task_with_user', {
        p_task_name: formData.task_name,
        p_task_description: formData.task_description || null,
        p_project_id: projectId,
        p_status: 'To Do',
        p_priority: formData.priority,
        p_due_date: formData.due_date,
        p_comments: formData.comments || null,
        p_user_id: user.id
      });

      if (taskError) {
        console.error('❌ Error creating task:', taskError);
        throw new Error(`Failed to create task: ${taskError.message || taskError.code || JSON.stringify(taskError)}`);
      }

      if (!newTaskId) {
        console.error('❌ No task ID returned from RPC');
        throw new Error('Failed to create task: No task ID returned');
      }

      console.log('✅ Task created with ID:', newTaskId);

      // ✅ Insert assignees using wrapper function
      if (selectedAssignees.length > 0) {
        console.log('👥 Assigning to:', selectedAssignees);
        
        for (const profileId of selectedAssignees) {
          const { error: assignError } = await supabase.rpc('assign_task_with_user', {
            p_task_id: newTaskId,
            p_profile_id: profileId,
            p_assigned_by: user.id,
            p_user_id: user.id
          });

          if (assignError) {
            console.error('❌ Error assigning user:', assignError);
            console.warn('Task created but failed to assign user:', assignError.message);
          }
        }
        
        console.log('✅ Assignees added successfully');
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