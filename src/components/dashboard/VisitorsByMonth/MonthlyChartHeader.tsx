import React from "react";

interface MonthlyChartHeaderProps {
  title: string;
  subtitle: string;
}

export const MonthlyChartHeader = ({ title, subtitle }: MonthlyChartHeaderProps) => {
  return (
    <div className="flex items-center justify-between w-auto">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
};