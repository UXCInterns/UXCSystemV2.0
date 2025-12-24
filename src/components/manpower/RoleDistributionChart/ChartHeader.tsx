import React from "react";

interface ChartHeaderProps {
  title: string;
  subtitle?: string;
}

export const ChartHeader = ({ title, subtitle }: ChartHeaderProps) => {
  return (
    <div className="flex items-center justify-between w-auto mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};