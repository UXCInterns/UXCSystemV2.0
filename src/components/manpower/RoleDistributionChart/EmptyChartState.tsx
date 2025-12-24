import React from "react";

interface EmptyChartStateProps {
  message?: string;
}

export const EmptyChartState = ({ 
  message = "No data available" 
}: EmptyChartStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">📊</div>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
        {message}
      </p>
    </div>
  );
};