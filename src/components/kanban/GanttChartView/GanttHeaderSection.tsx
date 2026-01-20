import React from 'react';
import Button from '@/components/ui/button/Button';
import Toggle from '@/components/ui/toggle/Toggle';
import type { Range } from '@/components/ui/shadcn-io/gantt';
import { ZOOM_MIN, ZOOM_MAX, ZOOM_STEP } from '@/constants/GanttChartConstants/ganttConstants';

interface GanttHeaderSectionProps {
  range: Range;
  zoom: number;
  totalTasks: number;
  filteredTasks: number;
  hasActiveFilters: boolean;
  onRangeChange: (range: Range) => void;
  onZoomChange: (zoom: number) => void;
}

export const GanttHeaderSection: React.FC<GanttHeaderSectionProps> = ({
  range,
  zoom,
  totalTasks,
  filteredTasks,
  hasActiveFilters,
  onRangeChange,
  onZoomChange,
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">Gantt Chart</h1>
        {hasActiveFilters && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Showing {filteredTasks} of {totalTasks} tasks
          </p>
        )}
      </div>

      {/* Range Selector */}
      <Toggle
        options={[
          { value: 'daily', label: 'Daily' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly' }
        ]}
        selectedValue={range}
        onChange={(value) => onRangeChange(value as Range)}
      />

      {/* Zoom Controls */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onZoomChange(Math.max(ZOOM_MIN, zoom - ZOOM_STEP))}
          className="!px-3 !py-1.5"
        >
          −
        </Button>
        <span className="text-sm text-gray-700 dark:text-gray-300 min-w-[50px] text-center">
          {zoom}%
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onZoomChange(Math.min(ZOOM_MAX, zoom + ZOOM_STEP))}
          className="!px-3 !py-1.5"
        >
          +
        </Button>
      </div>
    </div>
  );
};