import React from "react";

interface MonthlyChartFooterSingleProps {
  totalVisitors: number;
  peakMonth: string;
}

export const MonthlyChartFooterSingle = ({ 
  totalVisitors, 
  peakMonth 
}: MonthlyChartFooterSingleProps) => {
  return (
    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>
        Total Period Visitors:{" "}
        <span className="font-semibold text-gray-800 dark:text-white">
          {totalVisitors}
        </span>
      </span>
      <span>
        Peak Month:{" "}
        <span className="font-semibold text-gray-800 dark:text-white">
          {peakMonth}
        </span>
      </span>
    </div>
  );
};