import React, { useState, useMemo } from 'react';
import type { Range } from '@/components/ui/shadcn-io/gantt';
import { useTasks } from '@/hooks/KanbanBoardHooks/useTasks';
import { useUser } from '@/hooks/useUser';
import { KanbanToolbar } from '@/components/kanban/KanbanBoardView/KanbanToolbar';
import { useGanttFilters } from '@/hooks/GanttChartHooks/useGanttFilters';
import { useProjectProfiles } from '@/hooks/GanttChartHooks/useProjectProfiles';
import { useTaskMove } from '@/hooks/GanttChartHooks/useTaskMove';
import { useProjectPermissions } from '@/hooks/KanbanBoardHooks/KanbanBoard/useProjectPermissions';
import { convertTasksToFeatures, groupFeaturesByStatus } from '@/utils/GanttChartUtils/GanttChartViewUtils/ganttUtils';
import { GanttHeaderSection } from './GanttChartView/GanttHeaderSection';
import { GanttTimelineContent } from './GanttChartView/GanttTimelineContent';
import { GanttLoadingState } from './GanttChartView/GanttLoadingState';
import { GanttErrorState } from './GanttChartView/GanttErrorState';
import { AlertCircle } from 'lucide-react';

interface GanttChartProps {
  projectId: string;
}

export default function GanttChart({ projectId }: GanttChartProps) {
  const [range, setRange] = useState<Range>('monthly');
  const [zoom, setZoom] = useState(100);

  const { tasks, loading, error, setTasks } = useTasks(projectId);
  const { id: currentUserId } = useUser();
  const { profiles } = useProjectProfiles(projectId);
  
  // Permission check - NEW
  const { isProjectMember, loading: permissionsLoading } = useProjectPermissions(
    projectId,
    currentUserId || undefined
  );
  
  const {
    searchQuery,
    setSearchQuery,
    showMyTasksOnly,
    setShowMyTasksOnly,
    activeFilters,
    setActiveFilters,
    filteredTasks,
    hasActiveFilters,
  } = useGanttFilters(tasks, currentUserId);

  const handleMove = useTaskMove(tasks, setTasks);
  
  // Wrap handleMove to check permissions - NEW
  const handleMoveWithPermission = (id: string, startAt: Date, endAt: Date | null) => {
    if (!isProjectMember) {
      console.warn('Only project members can move tasks');
      return;
    }
    handleMove(id, startAt, endAt);
  };

  const features = useMemo(() => {
    return convertTasksToFeatures(filteredTasks);
  }, [filteredTasks]);
  
  const groupedFeatures = useMemo(() => {
    return groupFeaturesByStatus(features);
  }, [features]);

  // Combined loading state
  const isLoading = loading || permissionsLoading;

  if (isLoading) {
    return <GanttLoadingState />;
  }

  if (error) {
    return <GanttErrorState error={error} />;
  }

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="p-6 space-y-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] h-full flex flex-col">
        {/* View-Only Banner for non-members - NEW */}
        {!permissionsLoading && !isProjectMember && (
          <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-800 dark:text-blue-200 text-sm">
            <AlertCircle size={16} />
            <span>You are viewing this Gantt chart in read-only mode. Only project members can edit tasks.</span>
          </div>
        )}

        {/* Header and Toolbar */}
        <div className="space-y-4">
          <GanttHeaderSection
            range={range}
            zoom={zoom}
            totalTasks={tasks.length}
            filteredTasks={filteredTasks.length}
            hasActiveFilters={hasActiveFilters}
            canEdit={isProjectMember} // NEW: Pass permission
            onRangeChange={setRange}
            onZoomChange={setZoom}
          />

          <div className="border-t border-gray-200 dark:border-gray-700" />

          <KanbanToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showMyTasksOnly={showMyTasksOnly}
            setShowMyTasksOnly={setShowMyTasksOnly}
            currentUserId={currentUserId}
            profiles={profiles}
            onFilterChange={setActiveFilters}
            activeFilters={activeFilters}
          />
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <GanttTimelineContent
            range={range}
            zoom={zoom}
            groupedFeatures={groupedFeatures}
            tasks={tasks}
            filteredTasks={filteredTasks}
            onMove={handleMoveWithPermission} // NEW: Use permission-wrapped handler
            canEdit={isProjectMember} // NEW: Pass permission
          />
        </div>
      </div>
    </div>
  );
}