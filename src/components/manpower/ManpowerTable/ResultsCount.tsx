// Displays the count of filtered results
import React from "react";

interface ResultsCountProps {
  loading: boolean;
  error: string | null;
  currentCount: number;
  totalCount: number;
}

export const ResultsCount = ({ 
  loading, 
  error, 
  currentCount, 
  totalCount 
}: ResultsCountProps) => {
  return (
    <div className="px-5 py-3 border-b border-gray-200 dark:border-white/[0.05]">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {loading 
          ? 'Loading...' 
          : error 
          ? 'Error loading data' 
          : `Showing ${currentCount} of ${totalCount} people`}
      </span>
    </div>
  );
};
