// Error state component for Industry Metrics section
import React from "react";

interface IndustryMetricsErrorStateProps {
  error: Error;
}

export const IndustryMetricsErrorState = ({ error }: IndustryMetricsErrorStateProps) => {
  return (
    <div className="p-6 rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
      <p className="text-red-600 dark:text-red-400">
        Failed to load metrics: {error.message}
      </p>
    </div>
  );
};