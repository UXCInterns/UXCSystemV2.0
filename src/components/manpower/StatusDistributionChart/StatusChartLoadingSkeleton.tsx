// Loading skeleton for status distribution chart
import React from "react";

export const StatusChartLoadingSkeleton = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="flex flex-col items-center gap-6 xl:flex-row">
        <div className="w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex flex-col gap-4 w-full xl:w-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
