import React from 'react';

interface GanttLoadingStateProps {
  message?: string;
}

export const GanttLoadingState: React.FC<GanttLoadingStateProps> = ({ 
  message = 'Loading tasks...' 
}) => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)] p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};