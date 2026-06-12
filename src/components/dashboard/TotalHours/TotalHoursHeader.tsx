import React from "react";

interface TotalHoursHeaderProps {
  isComparisonMode: boolean;
  primaryLabel: string;
  comparisonLabel?: string;
}


export const TotalHoursHeader = ({
  isComparisonMode,
  primaryLabel,
  comparisonLabel,
}: TotalHoursHeaderProps) => {
  return (
    <div className="flex justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Learning Journey
        </h3>

        <p className="font-normal text-gray-500 text-theme-sm dark:text-gray-400">
          {isComparisonMode
            ? `${primaryLabel} vs ${comparisonLabel}`
            : `Total Learning Journey Hours - ${primaryLabel}`}
        </p>
      </div>
    </div>
  );
};
