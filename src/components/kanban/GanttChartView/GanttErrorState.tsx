import React from 'react';

interface GanttErrorStateProps {
  error: string;
}

export const GanttErrorState: React.FC<GanttErrorStateProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)] p-6">
      <div className="text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    </div>
  );
};