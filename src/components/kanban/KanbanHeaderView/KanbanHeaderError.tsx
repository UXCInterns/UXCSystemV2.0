import React from 'react';

interface KanbanHeaderErrorProps {
  error: string;
}

export const KanbanHeaderError: React.FC<KanbanHeaderErrorProps> = ({ error }) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/[0.1]">
      <p className="text-red-600 dark:text-red-400">{error}</p>
    </div>
  );
};