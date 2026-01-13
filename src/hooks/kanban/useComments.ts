import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../lib/supabase/supabaseClient';
import type { TaskComment } from '../../types/kanban';

export function useComments(taskId?: string) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);

  // Fetch comments directly from Supabase
  const fetchComments = useCallback(async (silent = false) => {
    if (!taskId) {
      setComments([]);
      return;
    }

    // Prevent too frequent fetches
    const now = Date.now();
    if (now - lastFetchRef.current < 300) {
      return;
    }
    lastFetchRef.current = now;

    if (!silent) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('task_comments_details')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [taskId]);

  // Initial fetch
  useEffect(() => {
    if (taskId) {
      fetchComments();
    }
  }, [taskId, fetchComments]);

  const addComment = async (taskId: string, commentText: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('You must be logged in to comment');
        return false;
      }

      // Optimistic update - add temporary comment immediately
      const tempComment: TaskComment = {
        comment_id: `temp-${Date.now()}`,
        task_id: taskId,
        comment_text: commentText.trim(),
        commenter_id: user.id,
        commenter_name: user.user_metadata?.full_name || user.email || 'You',
        commenter_avatar: user.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_edited: false,
      };

      setComments(prev => [...prev, tempComment]);

      const { error } = await supabase
        .from('task_comments')
        .insert({
          task_id: taskId,
          profile_id: user.id,
          comment_text: commentText.trim(),
        });

      if (error) throw error;

      // Refresh to get the real comment with proper ID
      setTimeout(() => fetchComments(true), 300);
      
      return true;
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
      
      // Remove optimistic comment on error
      setComments(prev => prev.filter(c => !c.comment_id.startsWith('temp-')));
      return false;
    }
  };

  const editComment = async (commentId: string, commentText: string): Promise<boolean> => {
    // Optimistic update
    setComments(prev =>
      prev.map(c =>
        c.comment_id === commentId
          ? { ...c, comment_text: commentText.trim(), is_edited: true, updated_at: new Date().toISOString() }
          : c
      )
    );

    try {
      const { error } = await supabase
        .from('task_comments')
        .update({
          comment_text: commentText.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('comment_id', commentId);

      if (error) throw error;

      // Silent refresh to sync
      setTimeout(() => fetchComments(true), 300);
      
      return true;
    } catch (err) {
      console.error('Error editing comment:', err);
      alert('Failed to edit comment. Please try again.');
      
      // Revert on error
      fetchComments(true);
      return false;
    }
  };

  const deleteComment = async (commentId: string): Promise<boolean> => {
    // Optimistic update - remove immediately
    const previousComments = comments;
    setComments((prev) => prev.filter(c => c.comment_id !== commentId));
    
    try {
      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('comment_id', commentId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment. Please try again.');
      
      // Revert on error
      setComments(previousComments);
      return false;
    }
  };

  return {
    comments,
    loadingComments: isLoading,
    error,
    addComment,
    editComment,
    deleteComment,
    isRealtimeConnected: true, // Always "connected"
  };
}