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

  // Event handlers
  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowCreatePanel(true);
  };

  const handleCreateSuccess = () => {
    fetchTasks();
    setShowCreatePanel(false);
  };

  const handleDragStart = (event: any) => {
    taskOperations.handleDragStart(event, dragStartColumnRef, tasks);
  };

  const handleDragEnd = (event: any) => {
    taskOperations.handleDragEnd(event, dragStartColumnRef, tasks);
  };

  return (
    <KanbanLoadingError loading={loading} error={error} onRetry={fetchTasks}>
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Main Kanban Area */}
        <div className={`transition-all duration-300 ${(selectedTask || showCreatePanel) ? 'w-[calc(100%-410px)]' : 'w-full'}`}>
          <div className="p-6 space-y-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] h-full flex flex-col">
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
            />

            <KanbanBoardContent
              viewMode={viewMode}
              tasks={filteredTasks}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onTaskClick={setSelectedTask}
              showCompactView={!!(selectedTask || showCreatePanel)}
            />
          </div>
        </div>

        {/* Side Panels */}
        {showCreatePanel && (
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
          />
        )}
      </div>
    </KanbanLoadingError>
  );
}