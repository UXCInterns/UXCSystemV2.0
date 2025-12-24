import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Check, XIcon, ArrowUp } from 'lucide-react';
import Avatar from '../../ui/avatar/Avatar';
import type { TaskComment } from '@/types/KanbanBoardTypes/kanban';

type Props = {
  comments: TaskComment[];
  loadingComments: boolean;
  commentCount: number;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  onAddComment: (commentText: string) => Promise<boolean>;
  onEditComment?: (commentId: string, commentText: string) => Promise<boolean>;
  onDeleteComment?: (commentId: string) => Promise<boolean>;
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export function TaskCommentsSection({
  comments,
  loadingComments,
  commentCount,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: Props) {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    const success = await onAddComment(newComment.trim());
    if (success) {
      setNewComment('');
    }
  };

  const handleStartEdit = (comment: TaskComment) => {
    setEditingCommentId(comment.comment_id);
    setEditingText(comment.comment_text);
    setOpenDropdownId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editingText.trim() || !onEditComment) return;
    
    const success = await onEditComment(editingCommentId, editingText.trim());
    if (success) {
      setEditingCommentId(null);
      setEditingText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingText('');
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!onDeleteComment) return;
    
    if (confirm('Are you sure you want to delete this comment?')) {
      await onDeleteComment(commentId);
      setOpenDropdownId(null);
    }
  };

  return (
    <div className="pt-4 border-t border-gray-200 dark:border-white/[0.05]">
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Discussion ({commentCount})
      </h4>

      {/* Comments List */}
      <div className="space-y-4 mb-4">
        {loadingComments ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Loading comments...
          </p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div 
              key={comment.comment_id} 
              className="flex gap-1.5 group relative"
            >
              <Avatar
                src={comment.commenter_avatar}
                name={comment.commenter_name}
                className="flex-shrink-0 mt-1"
                size="xsmall"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {comment.commenter_name}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {comment.is_edited ? formatDate(comment.updated_at) : formatDate(comment.created_at)}
                      {comment.is_edited && ' (edited)'}
                    </span>
                  </div>
                  
                  {/* Dropdown menu - only show if user is the commenter */}
                  {currentUserId && comment.commenter_id === currentUserId && (
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdownId(
                          openDropdownId === comment.comment_id ? null : comment.comment_id
                        )}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-opacity"
                      >
                        <MoreVertical size={16} className="text-gray-500 dark:text-gray-400" />
                      </button>
                      
                      {openDropdownId === comment.comment_id && (
                        <>
                          <div 
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenDropdownId(null)}
                          />
                          
                          <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/[0.1] rounded-lg shadow-lg z-20 overflow-hidden">
                            <button
                              onClick={() => handleStartEdit(comment)}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] flex items-center gap-2"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.comment_id)}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Comment text or edit mode */}
                {editingCommentId === comment.comment_id ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full text-sm text-gray-700 dark:text-gray-300 border-none bg-transparent p-0 focus:ring-0 focus:outline-none leading-relaxed"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveEdit();
                          }
                          if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                      <button
                        onClick={handleSaveEdit}
                        disabled={!editingText.trim()}
                        className="flex items-center justify-center p-1 rounded-full bg-success-500 text-white ml-2 hover:bg-success-600"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center justify-center p-1 rounded-full bg-error-500 text-white ml-2 hover:bg-error-600"
                      >
                        <XIcon size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {comment.comment_text}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No comments yet. Start the discussion!
          </p>
        )}
      </div>

      {/* Add Comment */}
      <div className="flex gap-1.5 items-start border-b border-gray-200 dark:border-white/[0.05] pb-1.5">
        <Avatar
          src={currentUserAvatar}
          name={currentUserName || 'User'}
          className="flex-shrink-0 mt-0.5"
          size="xsmall"
        />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 text-sm text-gray-700 dark:text-gray-300 border-none bg-transparent p-0 focus:ring-0 focus:outline-none leading-relaxed"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
          className={`flex items-center justify-center p-1 rounded-full text-white transition-colors ${
            newComment.trim() 
              ? 'bg-blue-700 hover:bg-blue-900' 
              : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
          }`}
        >
          <ArrowUp size={14} />
        </button>
      </div>
    </div>
  );
}