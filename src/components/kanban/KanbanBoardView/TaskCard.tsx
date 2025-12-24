import React from 'react';
import Badge from "@/components/ui/badge/Badge";
import { getPriorityBadgeProps } from '@/utils/CommonUtils/badgeUtils';
import type { Task } from '@/types/KanbanBoardTypes/kanban';
import Avatar from '../../ui/avatar/Avatar';
import { ChatIcon } from '@/icons';

type Props = {
  task: Task;
  onExpand: (task: Task) => void;
};

export function TaskCard({ task, onExpand }: Props) {
  // ✅ Format due date to "28 August 2025"
  const formattedDueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="-m-3 p-3 rounded-lg">
      {/* Header with expand button */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <p className="m-0 font-medium text-sm text-gray-800 dark:text-white mb-1">
            {task.task_name}
          </p>
          <Badge size="sm" {...getPriorityBadgeProps(task.priority)}>
            {task.priority}
          </Badge>
        </div>
        <button
          data-no-dnd="true"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onExpand(task);
          }}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors shrink-0 cursor-pointer touch-none"
          title="Expand task"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500 dark:text-gray-400 pointer-events-none"
          >
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        </button>
      </div>

      {/* Description preview */}
      {task.task_description && (
        <p className="m-0 text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {task.task_description}
        </p>
      )}

      {/* ✅ Formatted Due date */}
      {formattedDueDate && (
        <p className="m-0 text-xs text-gray-600 dark:text-gray-400 mb-2">
          Due: {formattedDueDate}
        </p>
      )}

      {/* Assignees and Comments on the same line */}
      <div className="flex items-center justify-between">
        {/* Assignees */}
        <div className="flex -space-x-2">
          {task.assignees && task.assignees.length > 0 && (
            <>
              {task.assignees.slice(0, 3).map((assignee) => (
                <div key={assignee.id} className="inline-block">
                  <Avatar
                    src={assignee.avatar_url || null}
                    alt={assignee.name}
                    size="small"
                    name={assignee.name}
                    className="ring-1 ring-gray-300 dark:ring-gray-800"
                  />
                </div>
              ))}
              {task.assignees.length > 3 && (
                <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 text-xs text-gray-800 dark:bg-gray-600 dark:text-white ring-1 ring-gray-300 dark:ring-gray-800">
                  +{task.assignees.length - 3}
                </div>
              )}
            </>
          )}
        </div>

        {/* Comments */}
        {task.comment_count > 0 && (
          <div className="ml-auto flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <ChatIcon />
            {task.comment_count}
          </div>
        )}
      </div>
    </div>
  );
}
