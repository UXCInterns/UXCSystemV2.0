import React from "react";

interface TimelineChartEmptyStateProps {
  periodLabel: string;
}

export const TimelineChartEmptyState = ({ periodLabel }: TimelineChartEmptyStateProps) => {
  return (
    <div className="h-[310px] flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">📅</div>
        <p className="text-gray-500 dark:text-gray-400">
          No visits recorded for {periodLabel.toLowerCase()}
        </p>
      </div>
    </div>
  );
};