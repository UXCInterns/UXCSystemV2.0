import React from "react";

interface MonthlyChartFooterComparisonProps {
  primaryPeakMonth: string;
  comparisonPeakMonth: string;
}

export const MonthlyChartFooterComparison = ({ 
  primaryPeakMonth, 
  comparisonPeakMonth 
}: MonthlyChartFooterComparisonProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded bg-blue-500"></div>
        <div>
          Primary Peak Month:{" "}
          <span className="font-semibold text-gray-800 dark:text-white">
            {primaryPeakMonth}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end">
        <div className="w-2 h-2 rounded bg-error-400"></div>
        <div>
          Comparison Peak Month:{" "}
          <span className="font-semibold text-gray-800 dark:text-white">
            {comparisonPeakMonth}
          </span>
        </div>
      </div>
    </div>
  );
};