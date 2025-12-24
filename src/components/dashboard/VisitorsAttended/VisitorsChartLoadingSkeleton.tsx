import React from "react";

export const VisitorsChartLoadingSkeleton = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.00] animate-pulse h-[350px] flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">Loading metrics...</p>
    </div>
  );
};