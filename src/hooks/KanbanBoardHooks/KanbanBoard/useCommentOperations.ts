import type { Task } from '@/types/KanbanBoardTypes/kanban';

interface UseCommentOperationsProps {
  selectedTask: Task | null;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task | null>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addComment: (taskId: string, commentText: string) => Promise<boolean>;
  editComment: (commentId: string, commentText: string) => Promise<boolean>;
  deleteComment: (commentId: string) => Promise<boolean>;
}

export function useCommentOperations({
  selectedTask,
  setSelectedTask,
  setTasks,
  addComment,
  editComment,
  deleteComment
}: UseCommentOperationsProps) {

  const handleAddComment = async (commentText: string) => {
    if (!selectedTask) return false;
    
    const success = await addComment(selectedTask.id, commentText);
    if (success) {
      // Optimistic update for comment count
      const newCount = selectedTask.comment_count + 1;
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === selectedTask.id ? { ...t, comment_count: newCount } : t
        )
      );
      setSelectedTask({ ...selectedTask, comment_count: newCount });
    }
    return success;
  };

  const handleEditComment = async (commentId: string, commentText: string) => {
    return await editComment(commentId, commentText);
  };

  const handleDeleteComment = async (commentId: string) => {
    const success = await deleteComment(commentId);
    if (success && selectedTask) {
      // Optimistic update for comment count
      const newCount = Math.max(0, selectedTask.comment_count - 1);
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === selectedTask.id ? { ...t, comment_count: newCount } : t
        )
      );
      setSelectedTask({ ...selectedTask, comment_count: newCount });
    }
    return success;
  };

  return {
    handleAddComment,
    handleEditComment,
    handleDeleteComment
  };
}