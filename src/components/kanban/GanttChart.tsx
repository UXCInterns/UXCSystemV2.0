import React, { useState, useMemo } from 'react';
import type { Range } from '@/components/ui/shadcn-io/gantt';
import { useTasks } from '@/hooks/KanbanBoardHooks/useTasks';
import { useUser } from '@/hooks/useUser';
import { KanbanToolbar } from '@/components/kanban/KanbanBoardView/KanbanToolbar';
import { useGanttFilters } from '@/hooks/GanttChartHooks/useGanttFilters';
import { useProjectProfiles } from '@/hooks/GanttChartHooks/useProjectProfiles';
import { useTaskMove } from '@/hooks/GanttChartHooks/useTaskMove';
import { convertTasksToFeatures, groupFeaturesByStatus } from '@/utils/GanttChartUtils/GanttChartViewUtils/ganttUtils';
import { GanttHeaderSection } from './GanttChartView/GanttHeaderSection';
import { GanttTimelineContent } from './GanttChartView/GanttTimelineContent';
import { GanttLoadingState } from './GanttChartView/GanttLoadingState';
import { GanttErrorState } from './GanttChartView/GanttErrorState';

interface GanttChartProps {
  projectId: string;
}

export default function GanttChart({ projectId }: GanttChartProps) {
  const [range, setRange] = useState<Range>('monthly');
  const [zoom, setZoom] = useState(100);

  const { tasks, loading, error, setTasks } = useTasks(projectId);
  const { id: currentUserId } = useUser();
  const { profiles } = useProjectProfiles(projectId);
  
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

  const features = useMemo(() => {
    return convertTasksToFeatures(filteredTasks);
  }, [filteredTasks]);
  
  const groupedFeatures = useMemo(() => {
    return groupFeaturesByStatus(features);
  }, [features]);

  if (loading) {
    return <GanttLoadingState />;
  }

  if (error) {
    return <GanttErrorState error={error} />;
  }

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="p-6 space-y-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] h-full flex flex-col">
        {/* Header and Toolbar */}
        <div className="space-y-4">
          <GanttHeaderSection
            range={range}
            zoom={zoom}
            totalTasks={tasks.length}
            filteredTasks={filteredTasks.length}
            hasActiveFilters={hasActiveFilters}
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
            onMove={handleMove}
          />
        </div>
      </div>
    </div>
  );
}