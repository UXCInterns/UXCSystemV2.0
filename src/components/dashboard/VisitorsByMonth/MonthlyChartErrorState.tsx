import React from "react";

interface MonthlyChartErrorStateProps {
  error: Error;
}

export const MonthlyChartErrorState = ({ error }: MonthlyChartErrorStateProps) => {
  return (
    <div className="p-6 rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
      <p className="text-red-600 dark:text-red-400">
        Failed to load chart: {error.message}
      </p>
    </div>
  );
};