"use client";

import React from "react";
import { useTasks } from '@/hooks/KanbanBoardHooks/useTasks';
import { useComments } from '@/hooks/KanbanBoardHooks/useComments';
import { TaskSidePanel } from '@/components/kanban/TaskDetailsSidePanel/TaskSidePanel';
import AddTaskPanel from '@/components/kanban/AddTaskSidePanel/AddTaskPanel';
import KanbanBoardHeader from '@/components/kanban/KanbanBoardView/KanbanBoardHeader';
import KanbanBoardContent from '@/components/kanban/KanbanBoardView/KanbanBoardContent';
import KanbanLoadingError from '@/components/kanban/KanbanBoardView/KanbanLoadingError';
import { useKanbanState } from '@/hooks/KanbanBoardHooks/KanbanBoard/useKanbanState';
import { useCurrentUser } from '@/hooks/KanbanBoardHooks/KanbanBoard/useCurrentUser';
import { useProjectData } from '@/hooks/KanbanBoardHooks/KanbanBoard/useProjectData';
import { useTaskOperations } from '@/hooks/KanbanBoardHooks/KanbanBoard/useTaskOperations';
import { useCommentOperations } from '@/hooks/KanbanBoardHooks/KanbanBoard/useCommentOperations';
import { useTaskFilters } from '@/hooks/KanbanBoardHooks/KanbanBoard/useTaskFilters';
import { useProjectPermissions } from '@/hooks/KanbanBoardHooks/KanbanBoard/useProjectPermissions';
import { AlertCircle } from 'lucide-react';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import type { Task } from '@/types/KanbanBoardTypes/kanban';

export default function ProjectKanbanBoard({ projectId }: { projectId: string }) {
  // State management
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedTask,
    setSelectedTask,
    showMyTasksOnly,
    setShowMyTasksOnly,
    showCreatePanel,
    setShowCreatePanel,
    filters,
    setFilters,
    dragStartColumnRef
  } = useKanbanState();

  // User data
  const { currentUserId, currentUserName, currentUserAvatar } = useCurrentUser();

  // Project data
  const { profiles, projectMembers, projectName } = useProjectData(projectId);

  // Permission check - NEW
  const { isProjectMember, loading: permissionsLoading } = useProjectPermissions(
    projectId,
    currentUserId || undefined
  );

  // Task operations
  const { tasks, loading, error, fetchTasks, updateTaskStatus, setTasks } = useTasks(projectId);

  // Task CRUD operations
  const taskOperations = useTaskOperations({
    setTasks,
    selectedTask,
    setSelectedTask,
    updateTaskStatus
  });

  // Comment operations
  const {
    comments: taskComments,
    loadingComments,
    addComment,
    editComment,
    deleteComment,
  } = useComments(selectedTask?.id);

  const commentOperations = useCommentOperations({
    selectedTask,
    setSelectedTask,
    setTasks,
    addComment,
    editComment,
    deleteComment
  });

  // Filtered tasks
  const filteredTasks = useTaskFilters({
    tasks,
    searchQuery,
    showMyTasksOnly,
    currentUserId,
    filters
  });

  // Event handlers - with permission checks
  const handleCreateTask = () => {
    if (!isProjectMember) {
      // Optionally show a toast notification
      console.warn('Only project members can create tasks');
      return;
    }
    setSelectedTask(null);
    setShowCreatePanel(true);
  };

  const handleCreateSuccess = () => {
    fetchTasks();
    setShowCreatePanel(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    // Don't call preventDefault - just return early if not a member
    // The KanbanProvider's disabled prop will handle preventing drag
    if (!isProjectMember) {
      return;
    }
    taskOperations.handleDragStart(event, dragStartColumnRef, tasks);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isProjectMember) {
      return;
    }
    taskOperations.handleDragEnd(event, dragStartColumnRef, tasks);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  // Combined loading state
  const isLoading = loading || permissionsLoading;

  return (
    <KanbanLoadingError loading={isLoading} error={error} onRetry={fetchTasks}>
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Main Kanban Area */}
        <div className={`transition-all duration-300 ${(selectedTask || showCreatePanel) ? 'w-[calc(100%-410px)]' : 'w-full'}`}>
          <div className="p-6 space-y-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] h-full flex flex-col">
            
            {/* View-Only Banner for non-members */}
            {!permissionsLoading && !isProjectMember && (
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-200 text-sm">
                <AlertCircle size={16} />
                <span>You are viewing this project in read-only mode. Only project members can edit tasks.</span>
              </div>
            )}

            <KanbanBoardHeader
              viewMode={viewMode}
              setViewMode={setViewMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              showMyTasksOnly={showMyTasksOnly}
              setShowMyTasksOnly={setShowMyTasksOnly}
              currentUserId={currentUserId || undefined}
              profiles={profiles}
              filters={filters}
              onFilterChange={setFilters}
              onCreateTask={handleCreateTask}
              canEdit={isProjectMember} // Pass permission to header
            />

            <KanbanBoardContent
              viewMode={viewMode}
              tasks={filteredTasks}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onTaskClick={handleTaskClick}
              showCompactView={!!(selectedTask || showCreatePanel)}
              canEdit={isProjectMember} // Pass permission to content
            />
          </div>
        </div>

        {/* Side Panels */}
        {showCreatePanel && isProjectMember && (
          <AddTaskPanel
            projectId={projectId}
            projectName={projectName}
            profiles={profiles}
            projectMembers={projectMembers}
            onClose={() => setShowCreatePanel(false)}
            onSuccess={handleCreateSuccess}
          />
        )}

        {selectedTask && !showCreatePanel && (
          <TaskSidePanel
            task={selectedTask}
            comments={taskComments}
            loadingComments={loadingComments}
            profiles={profiles}
            projectMembers={projectMembers}
            onClose={() => setSelectedTask(null)}
            onUpdate={taskOperations.handleUpdateTask}
            onDelete={taskOperations.handleDeleteTask}
            onAddComment={commentOperations.handleAddComment}
            onEditComment={commentOperations.handleEditComment}
            onDeleteComment={commentOperations.handleDeleteComment}
            currentUserId={currentUserId || undefined}
            currentUserName={currentUserName || undefined}
            currentUserAvatar={currentUserAvatar || undefined}
            canEdit={isProjectMember} // Pass permission to side panel
          />
        )}
      </div>
    </KanbanLoadingError>
  );
}