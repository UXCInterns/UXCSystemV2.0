import React from "react";
import ChartTypeToggle from "@/components/common/ChartTypeToggle";
import { ChartType } from "@/types/LearningJourneyDashboardTypes/visitorsTimeline";

interface TimelineChartHeaderProps {
  title: string;
  subtitle: string;
  chartType: ChartType;
  onChartTypeChange: (type: ChartType) => void;
}

export const TimelineChartHeader = ({
  title,
  subtitle,
  chartType,
  onChartTypeChange,
}: TimelineChartHeaderProps) => {
  return (
    <div className="flex flex-col gap-5 mb-2 sm:flex-row sm:justify-between">
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          {subtitle}
        </p>
      </div>
      <div className="flex items-center justify-end gap-2">
        <ChartTypeToggle selectedType={chartType} onChange={onChartTypeChange} />
      </div>
    </div>
  );
};