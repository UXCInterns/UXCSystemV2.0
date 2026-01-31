import React from 'react';
import Avatar from '@/components/ui/avatar/Avatar';
import { Eye } from 'lucide-react';
import type { GanttFeature } from '@/components/ui/shadcn-io/gantt';
import type { Assignee } from '@/types/KanbanBoardTypes/kanban';

interface GanttTaskRowContentProps {
  feature: GanttFeature;
  assignees: Assignee[];
  canEdit?: boolean; // NEW: Permission prop
}

export const GanttTaskRowContent: React.FC<GanttTaskRowContentProps> = ({ 
  feature, 
  assignees,
  canEdit = true, // NEW: Default to true for backward compatibility
}) => {
  return (
    <div className="flex items-center gap-2 w-full">
      {/* Read-only indicator - NEW */}
      {!canEdit && (
        <Eye size={12} className="text-gray-400 flex-shrink-0" />
      )}
      
      {/* Task Name */}
      <p className="flex-1 truncate text-xs font-medium">{feature.name}</p>
      
      {/* Assignees */}
      {assignees.length > 0 && (
        <div className="flex -space-x-1 flex-shrink-0">
          {assignees.slice(0, 2).map((assignee) => (
            <div key={assignee.id} title={assignee.name}>
              <Avatar
                src={assignee.avatar_url}
                name={assignee.name}
                size="xsmall"
              />
            </div>
          ))}
          {assignees.length > 2 && (
            <div
              className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-[9px] font-medium border border-white dark:border-gray-800"
              title={`+${assignees.length - 2} more`}
            >
              +{assignees.length - 2}
            </div>
          )}
        </div>
      )}
    </div>
  );
};