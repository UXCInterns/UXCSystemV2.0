import React from 'react';
import { ChevronDown } from 'lucide-react';
import Badge from "@/components/ui/badge/Badge";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { getStatusBadgeProps, getPriorityBadgeProps } from '@/utils/badgeHelpers';
import type { Task } from '@/types/kanban';

type Props = {
  task: Task;
  isEditing: boolean;
  showDropdown: string | null;
  onUpdateTask: (updates: Partial<Task>) => void;
  onToggleDropdown: (dropdown: string | null) => void;
};

const STATUS_OPTIONS = ['To Do', 'In Progress', 'Review', 'Done'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export function TaskDetailsSection({ 
  task, 
  isEditing, 
  showDropdown, 
  onUpdateTask, 
  onToggleDropdown 
}: Props) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Details
      </h4>

      {/* Task Name */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Task Name</Label>
        {isEditing ? (
          <Input
            type="text"
            value={task.task_name}
            onChange={(e) => onUpdateTask({ task_name: e.target.value })}
            className="flex-1 px-0 border-none shadow-none focus:ring-0 font-medium"
            placeholder="Enter task name"
          />
        ) : (
          <p className="text-sm font-medium text-gray-800 dark:text-white">
            {task.task_name}
          </p>
        )}
      </div>

      {/* Project - Not Editable */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Project</Label>
        <p className="text-sm text-gray-800 dark:text-white">
          {task.project_name}
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Status</Label>
        {isEditing ? (
          <div className="relative flex-1">
            <button 
              onClick={() => onToggleDropdown(showDropdown === 'status' ? null : 'status')} 
              className="dropdown-toggle px-3 py-1.5 text-sm border border-gray-300 rounded-md flex items-center justify-between dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <Badge size="sm" {...getStatusBadgeProps(task.status)}>
                {task.status}
              </Badge>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            <Dropdown isOpen={showDropdown === 'status'} onClose={() => onToggleDropdown(null)} className="w-full max-h-64 overflow-auto">
              {STATUS_OPTIONS.map(status => (
                <DropdownItem
                  key={status}
                  onClick={() => {
                    onUpdateTask({ status: status as Task['status'] });
                    onToggleDropdown(null);
                  }}
                  baseClassName="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Badge size="sm" {...getStatusBadgeProps(status)}>
                    {status}
                  </Badge>
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        ) : (
          <Badge size="sm" {...getStatusBadgeProps(task.status)}>
            {task.status}
          </Badge>
        )}
      </div>

      {/* Priority */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Priority</Label>
        {isEditing ? (
          <div className="relative flex-1">
            <button 
              onClick={() => onToggleDropdown(showDropdown === 'priority' ? null : 'priority')} 
              className="dropdown-toggle px-3 py-1.5 text-sm border border-gray-300 rounded-md flex items-center justify-between dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <Badge size="sm" {...getPriorityBadgeProps(task.priority)}>
                {task.priority}
              </Badge>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            <Dropdown isOpen={showDropdown === 'priority'} onClose={() => onToggleDropdown(null)} className="w-full max-h-64 overflow-auto">
              {PRIORITY_OPTIONS.map(priority => (
                <DropdownItem
                  key={priority}
                  onClick={() => {
                    onUpdateTask({ priority: priority as Task['priority'] });
                    onToggleDropdown(null);
                  }}
                  baseClassName="w-full px-3 py-2.5 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Badge size="sm" {...getPriorityBadgeProps(priority)}>
                    {priority}
                  </Badge>
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
        ) : (
          <Badge size="sm" {...getPriorityBadgeProps(task.priority)}>
            {task.priority}
          </Badge>
        )}
      </div>
    </div>
  );
}