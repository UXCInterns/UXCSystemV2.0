// Empty state component for Industry Metrics section
import React from "react";

interface IndustryMetricsEmptyStateProps {
  periodLabel: string;
}

export const IndustryMetricsEmptyState = ({ periodLabel }: IndustryMetricsEmptyStateProps) => {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03]">
      <p className="text-gray-500 dark:text-gray-400">
        No stats available for {periodLabel.toLowerCase()}...
      </p>
    </div>
  );
};