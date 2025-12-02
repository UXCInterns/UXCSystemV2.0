import React from 'react';
import Label from "@/components/form/Label";
import Avatar from '../../ui/avatar/Avatar';
import type { Task, Assignee } from '@/types/kanban';
import type { Profile } from "@/types/project";

type Props = {
  task: Task;
  profiles: Profile[];
  isEditing: boolean;
  selectedAssignees: string[];
  onOpenModal: () => void;
};

export function TaskAssigneesSection({ 
  task, 
  profiles, 
  isEditing, 
  selectedAssignees,
  onOpenModal 
}: Props) {
  const renderAssignee = (assignee: Assignee) => (
    <div
      key={assignee.id}
      className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05]"
    >
      <Avatar
        src={assignee.avatar_url}
        name={assignee.name}
        size="xsmall"
      />
      <span className="text-xs text-gray-700 dark:text-gray-300">
        {assignee.name}
      </span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="border-t border-gray-200 dark:border-white/[0.05]"></div>
      <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
        Assignees
      </h4>
      
      <div className="flex items-start">
        <Label className="text-sm w-32 mb-0">Team</Label>
        <div className="flex flex-wrap gap-2 flex-1">
          {isEditing ? (
            // In edit mode, show assignees based on selectedAssignees
            selectedAssignees.length > 0 ? (
              selectedAssignees.map((assigneeId) => {
                const profile = profiles.find(p => p.id === assigneeId);
                if (!profile) return null;
                return (
                  <div
                    key={assigneeId}
                    className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.05]"
                  >
                    <Avatar
                      src={profile.avatar_url}
                      name={profile.full_name || profile.email}
                      size="xsmall"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {profile.full_name || 'Unknown'}
                    </span>
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">No assignees</span>
            )
          ) : (
            // In view mode, show actual task assignees
            task.assignees && task.assignees.length > 0 ? (
              task.assignees.map((assignee) => renderAssignee(assignee))
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">No assignees</span>
            )
          )}
          
          {isEditing && (
            <button 
              onClick={onOpenModal} 
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-dashed border-blue-400 text-blue-600 dark:text-blue-400 text-xs hover:bg-blue-50 dark:hover:bg-white/[0.05] transition-colors"
            >
              <span className="text-lg leading-none">+</span>
              Manage Assignees
            </button>
          )}
        </div>
      </div>
    </div>
  );
}