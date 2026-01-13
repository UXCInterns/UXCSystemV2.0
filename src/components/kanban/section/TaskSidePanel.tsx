import React, { useState, useEffect } from 'react';
import { X, Edit2, Trash2, Check } from 'lucide-react';
import TextArea from "@/components/form/input/TextArea";
import type { Task, TaskComment } from '@/types/kanban';
import type { Profile } from "@/types/project";
import AssigneesModal from './AssigneesModal';
import { TaskDetailsSection } from './TaskDetailsSection';
import { TaskTimelineSection } from './TaskTimelineSection';
import { TaskAssigneesSection } from './TaskAssigneesSection';
import { TaskCommentsSection } from './TaskCommentsSection';

type Props = {
  task: Task;
  comments: TaskComment[];
  loadingComments: boolean;
  profiles: Profile[];
  projectMembers?: string[];
  onClose: () => void;
  onUpdate?: (taskId: string, updates: Partial<Task> & { assignee_ids?: string[] }) => Promise<boolean>;
  onDelete?: (taskId: string) => Promise<boolean>;
  onAddComment: (commentText: string) => Promise<boolean>;
  onEditComment?: (commentId: string, commentText: string) => Promise<boolean>;
  onDeleteComment?: (commentId: string) => Promise<boolean>;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
};

export function TaskSidePanel({
  task,
  comments,
  loadingComments,
  profiles,
  projectMembers,
  onClose,
  onUpdate,
  onDelete,
  onAddComment,
  onEditComment,
  onDeleteComment,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showAssigneesModal, setShowAssigneesModal] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(
    task.assignees?.map(a => a.id) || []
  );

  // Exit edit mode when task changes
  useEffect(() => {
    setIsEditing(false);
    setEditedTask(task);
    setSelectedAssignees(task.assignees?.map(a => a.id) || []);
    setShowDropdown(null);
  }, [task.id]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask(task);
    setSelectedAssignees(task.assignees?.map(a => a.id) || []);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask(task);
    setSelectedAssignees(task.assignees?.map(a => a.id) || []);
    setShowDropdown(null);
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    
    const updates: Partial<Task> & { assignee_ids?: string[] } = {
      task_name: editedTask.task_name,
      task_description: editedTask.task_description,
      status: editedTask.status,
      priority: editedTask.priority,
      due_date: editedTask.due_date,
      started_at: editedTask.started_at,  // Add this line
      comments: editedTask.comments,
      assignee_ids: selectedAssignees,
    };

    const success = await onUpdate(task.id, updates);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleUpdateTask = (updates: Partial<Task>) => {
    setEditedTask(prev => ({ ...prev, ...updates }));
  };

  const handleToggleAssignee = (profileId: string) => {
    setSelectedAssignees(prev => 
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSaveAssignees = async () => {
    if (!onUpdate) return;
    
    const success = await onUpdate(task.id, {
      assignee_ids: selectedAssignees
    });
    
    if (success) {
      setShowAssigneesModal(false);
    } else {
      alert('Failed to update assignees. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      const success = await onDelete(task.id);
      if (success) {
        onClose();
      }
    }
  };

  const displayTask = isEditing ? editedTask : task;

  return (
    <>
      <div className="w-[390px] flex-shrink-0 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05] flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-800 dark:text-white/90">
            Task Details
          </h3>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                  title="Save"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  title="Cancel"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                {onUpdate && (
                  <button
                    onClick={handleEdit}
                    className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-4">
            {/* Details Section */}
            <TaskDetailsSection
              task={displayTask}
              isEditing={isEditing}
              showDropdown={showDropdown}
              onUpdateTask={handleUpdateTask}
              onToggleDropdown={setShowDropdown}
            />

            {/* Timeline Section */}
            <TaskTimelineSection
              task={displayTask}
              isEditing={isEditing}
              onUpdateTask={handleUpdateTask}
            />

            {/* Assignees Section */}
            <TaskAssigneesSection
              task={displayTask}
              profiles={profiles}
              isEditing={isEditing}
              selectedAssignees={selectedAssignees}
              onOpenModal={() => setShowAssigneesModal(true)}
            />

            {/* Description */}
            <div className="pt-4 border-t border-gray-200 dark:border-white/[0.05]">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
                Description
              </h4>
              {isEditing ? (
                <TextArea
                  value={displayTask.task_description}
                  onChange={(value) => handleUpdateTask({ task_description: value })}
                  rows={4}
                  placeholder="Enter task description"
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {displayTask.task_description || 'No description provided.'}
                </p>
              )}
            </div>

            {/* Internal Notes */}
            <div className="pt-4 border-t border-gray-200 dark:border-white/[0.05]">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
                Internal Notes
              </h4>
              {isEditing ? (
                <TextArea
                  value={displayTask.comments || ''}
                  onChange={(value) => handleUpdateTask({ comments: value })}
                  rows={3}
                  placeholder="Enter internal notes"
                />
              ) : (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {displayTask.comments || 'No notes.'}
                </p>
              )}
            </div>

            {/* Comments Section */}
            <TaskCommentsSection
              comments={comments}
              loadingComments={loadingComments}
              commentCount={task.comment_count}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              currentUserAvatar={currentUserAvatar}
              onAddComment={onAddComment}
              onEditComment={onEditComment}
              onDeleteComment={onDeleteComment}
            />
          </div>
        </div>
      </div>

      {/* Assignees Modal */}
      {showAssigneesModal && (
        <AssigneesModal
          profiles={profiles}
          selectedAssignees={selectedAssignees}
          projectMembers={projectMembers}
          onToggle={handleToggleAssignee}
          onSave={handleSaveAssignees}
          onClose={() => setShowAssigneesModal(false)}
        />
      )}
    </>
  );
}