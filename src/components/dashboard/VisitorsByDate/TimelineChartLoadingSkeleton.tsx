import React from "react";

export const TimelineChartLoadingSkeleton = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-5 mb-2 sm:flex-row sm:justify-between">
        <div className="w-full">
          <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full h-[310px] flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading timeline chart...</div>
        </div>
      </div>
    </div>
  );
};