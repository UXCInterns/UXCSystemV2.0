import React from "react";
import { Profile } from "@/types/ProjectsTypes/project";
import Label from "@/components/form/Label";
import Avatar from "@/components/ui/avatar/Avatar";

interface TaskAssigneesSectionProps {
  assignees: Profile[];
  onManageClick: () => void;
}

export default function AddTaskAssigneesSection({
  assignees,
  onManageClick
}: TaskAssigneesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="border-t border-gray-200 dark:border-white/[0.05]"></div>
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Assignees
      </h4>

      <div className="flex items-start">
        <Label className="text-sm w-32 mb-0 pt-1">Team</Label>
        <div className="flex flex-wrap gap-2 flex-1 mt-1">
          {assignees.length > 0 ? (
            assignees.map((assignee) => (
              <div 
                key={assignee.id} 
                className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05]"
              >
                <Avatar 
                  src={assignee.avatar_url}
                  name={assignee.full_name || assignee.email}
                  size="xsmall"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {assignee.full_name || 'Unknown'}
                </span>
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">No assignees</span>
          )}
          <button 
            onClick={onManageClick} 
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-blue-400 text-blue-600 dark:text-blue-400 text-xs hover:bg-blue-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            Manage Assignees
          </button>
        </div>
      </div>
    </div>
  );
}