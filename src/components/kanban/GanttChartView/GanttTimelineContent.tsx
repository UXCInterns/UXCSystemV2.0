import React from 'react';
import {
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
  GanttToday,
  type GanttFeature,
  type Range,
} from '@/components/ui/shadcn-io/gantt';
import type { Task } from '@/types/KanbanBoardTypes/kanban';
import { GanttTaskRowContent } from './GanttTaskRowContent';
import { GanttEmptyState } from './GanttEmptyState';

interface GanttTimelineContentProps {
  range: Range;
  zoom: number;
  groupedFeatures: Map<string, GanttFeature[]>;
  tasks: Task[];
  filteredTasks: Task[];
  onMove: (id: string, startAt: Date, endAt: Date | null) => void;
  canEdit?: boolean; // Permission prop
}

export const GanttTimelineContent: React.FC<GanttTimelineContentProps> = ({
  range,
  zoom,
  groupedFeatures,
  tasks,
  filteredTasks,
  onMove,
  canEdit = true,
}) => {
  if (filteredTasks.length === 0) {
    return <GanttEmptyState />;
  }

  return (
    <GanttProvider range={range} zoom={zoom}>
      <GanttSidebar className="bg-white dark:bg-gray-900">
        {Array.from(groupedFeatures.entries()).map(([status, statusFeatures]) => (
          <GanttSidebarGroup key={status} name={status}>
            {statusFeatures.map((feature) => (
              <GanttSidebarItem
                key={feature.id}
                feature={feature}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              />
            ))}
          </GanttSidebarGroup>
        ))}
      </GanttSidebar>
      
      <GanttTimeline className="bg-gray-50 dark:bg-gray-900">
        <GanttHeader />
        <GanttFeatureList>
          {Array.from(groupedFeatures.entries()).map(([status, statusFeatures]) => (
            <GanttFeatureListGroup key={status}>
              {statusFeatures.map((feature) => {
                const task = tasks.find(t => t.id === feature.id);
                const assignees = task?.assignees || [];
                
                return (
                  <GanttFeatureRow
                    key={feature.id}
                    features={[feature]}
                    // CRITICAL: Don't pass onMove at all if user can't edit
                    // This prevents the drag handlers from even being created
                    {...(canEdit ? { onMove } : {})}
                  >
                    {(f) => (
                      <div 
                        className={canEdit ? '' : 'pointer-events-none select-none'}
                        style={canEdit ? {} : { cursor: 'default' }}
                      >
                        <GanttTaskRowContent 
                          feature={f} 
                          assignees={assignees}
                          canEdit={canEdit}
                        />
                      </div>
                    )}
                  </GanttFeatureRow>
                );
              })}
            </GanttFeatureListGroup>
          ))}
        </GanttFeatureList>
        <GanttToday className="bg-blue-500" />
      </GanttTimeline>
    </GanttProvider>
  );
};