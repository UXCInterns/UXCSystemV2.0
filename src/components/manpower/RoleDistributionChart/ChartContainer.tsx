import React from "react";

interface ChartContainerProps {
  children: React.ReactNode;
}

export const ChartContainer = ({ children }: ChartContainerProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      {children}
    </div>
  );
};