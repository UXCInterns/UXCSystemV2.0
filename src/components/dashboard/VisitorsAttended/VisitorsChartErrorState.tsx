import React from "react";

interface VisitorsChartErrorStateProps {
  error: Error;
}

export const VisitorsChartErrorState = ({ error }: VisitorsChartErrorStateProps) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-5">
      <p className="text-red-600 dark:text-red-400">
        Failed to load metrics: {error.message}
      </p>
    </div>
  );
};