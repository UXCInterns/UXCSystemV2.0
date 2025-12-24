import React from "react";

interface VisitorsChartHeaderProps {
  isComparisonMode: boolean;
  primaryLabel: string;
  comparisonLabel?: string;
}

export const VisitorsChartHeader = ({
  isComparisonMode,
  primaryLabel,
  comparisonLabel,
}: VisitorsChartHeaderProps) => {
  return (
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Visitors Attended
        </h3>
        <p className="font-normal text-gray-500 text-theme-sm dark:text-gray-400">
          {isComparisonMode 
            ? `${primaryLabel} vs ${comparisonLabel}`
            : `Total visitors attended - ${primaryLabel}`
          }
        </p>
      </div>
    </div>
  );
};