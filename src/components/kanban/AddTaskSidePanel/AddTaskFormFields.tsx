import React from "react";
import { ChevronDown } from "lucide-react";
import Label from "@/components/form/Label";
import Badge from "@/components/ui/badge/Badge";
import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/input/InputField";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { getStatusBadgeProps, getPriorityBadgeProps } from '@/utils/CommonUtils/badgeUtils';

interface TaskFormFieldsProps {
  formData: {
    task_name: string;
    task_description: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    started_at: string;
    due_date: string;
    comments: string;
  };
  projectName: string;
  onUpdate: (field: string, value: string) => void;
  showDropdown: string | null;
  onDropdownChange: (value: string | null) => void;
}

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

const dateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AddTaskFormFields({
  formData,
  projectName,
  onUpdate,
  showDropdown,
  onDropdownChange
}: TaskFormFieldsProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Details
      </h4>

      {/* Task Name */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Task Name <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          value={formData.task_name}
          onChange={(e) => onUpdate('task_name', e.target.value)}
          className="flex-1 px-0 border-none shadow-none focus:ring-0 font-medium"
          placeholder="Enter task name"
        />
      </div>

      {/* Project - Display Only */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Project</Label>
        <p className="text-sm text-gray-800 dark:text-white">
          {projectName}
        </p>
      </div>

      {/* Status - Display Only */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Status</Label>
        <Badge size="sm" {...getStatusBadgeProps('To Do')}>
          To Do
        </Badge>
      </div>

      {/* Priority */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Priority</Label>
        <div className="relative flex-1">
          <button 
            onClick={() => onDropdownChange(showDropdown === 'priority' ? null : 'priority')} 
            className="dropdown-toggle px-3 py-1.5 text-sm border border-gray-300 rounded-md flex items-center justify-between dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <Badge size="sm" {...getPriorityBadgeProps(formData.priority)}>
              {formData.priority}
            </Badge>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          <Dropdown isOpen={showDropdown === 'priority'} onClose={() => onDropdownChange(null)} className="w-full max-h-64 overflow-auto">
            {PRIORITY_OPTIONS.map(priority => (
              <DropdownItem
                key={priority}
                onClick={() => {
                  onUpdate('priority', priority);
                  onDropdownChange(null);
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
      </div>

      {/* Timeline Section */}
      <div className="border-t border-gray-200 dark:border-white/[0.05]"></div>
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Timeline
      </h4>

      {/* Started At */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Started <span className="text-red-500">*</span></Label>
        <div className="flex-1">
          <DatePicker
            id="new-task-started-at"
            mode="single"
            onChange={(selectedDates) => {
              if (selectedDates.length > 0) {
                const localDateString = dateToLocalString(selectedDates[0]);
                onUpdate('started_at', localDateString);
              }
            }}
            placeholder="Select start date"
          />
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center">
        <Label className="text-sm w-32 mb-0">Due Date <span className="text-red-500">*</span></Label>
        <div className="flex-1">
          <DatePicker
            id="new-task-due-date"
            mode="single"
            onChange={(selectedDates) => {
              if (selectedDates.length > 0) {
                const localDateString = dateToLocalString(selectedDates[0]);
                onUpdate('due_date', localDateString);
              }
            }}
            placeholder="Select due date"
          />
        </div>
      </div>
    </div>
  );
}