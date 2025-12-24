import React from 'react';

interface DueDateSectionProps {
  dueDate: string;
}

export const DueDateSection: React.FC<DueDateSectionProps> = ({ dueDate }) => {
  return (
    <div className="flex flex-col text-xs text-gray-400 tracking-wide w-[20%]">
      <span className="mb-1 uppercase">Due Date</span>
      <span className="text-xl font-bold text-gray-800 dark:text-white/90 mt-0.5">
        {dueDate}
      </span>
    </div>
  );
};