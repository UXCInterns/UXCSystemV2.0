import React from 'react';

interface GanttEmptyStateProps {
  message?: string;
  hint?: string;
}

export const GanttEmptyState: React.FC<GanttEmptyStateProps> = ({ 
  message = 'No tasks found',
  hint = 'Try adjusting your filters or search query'
}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-2">{message}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">{hint}</p>
      </div>
    </div>
  );
};