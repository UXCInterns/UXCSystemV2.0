import React from 'react';
import Label from "@/components/form/Label";
import DatePicker from "@/components/form/date-picker";
import type { Task } from '@/types/KanbanBoardTypes/kanban';

type Props = {
  task: Task;
  isEditing: boolean;
  onUpdateTask: (updates: Partial<Task>) => void;
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const dateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function TaskTimelineSection({ task, isEditing, onUpdateTask }: Props) {
  return (
    <div className="space-y-4">
      <div className="border-t border-gray-200 dark:border-white/[0.05]"></div>
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Timeline
      </h4>

      {/* Started At */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Started</Label>
        {isEditing ? (
          <div className="flex-1">
            <DatePicker
              id={`started-at-${task.id}`}
              mode="single"
              defaultDate={
                task.started_at ? new Date(task.started_at.split('T')[0]) : undefined
              }
              onChange={(selectedDates) => {
                if (selectedDates.length > 0) {
                  const localDateString = dateToLocalString(selectedDates[0]);
                  onUpdateTask({ started_at: localDateString });
                }
              }}
              placeholder="Select start date"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-800 dark:text-white">
            {task.started_at ? formatDate(task.started_at) : 'Not set'}
          </p>
        )}
      </div>

      {/* Due Date */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Due Date</Label>
        {isEditing ? (
          <div className="flex-1">
            <DatePicker
              id={`due-date-${task.id}`}
              mode="single"
              defaultDate={
                task.due_date ? new Date(task.due_date.split('T')[0]) : undefined
              }
              onChange={(selectedDates) => {
                if (selectedDates.length > 0) {
                  const localDateString = dateToLocalString(selectedDates[0]);
                  onUpdateTask({ due_date: localDateString });
                }
              }}
              placeholder="Select due date"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-800 dark:text-white">
            {task.due_date ? formatDate(task.due_date) : 'Not set'}
          </p>
        )}
      </div>
    </div>
  );
}