import React from 'react';

interface ProgressSectionProps {
  progress: number;
  isLive: boolean;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({ 
  progress, 
  isLive 
}) => {
  return (
    <div className="flex flex-col text-xs text-gray-400 tracking-wide w-[20%]">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="uppercase">Progress</span>
        {isLive && (
          <span 
            className="w-2 h-2 rounded-full bg-green-500 animate-pulse" 
            title="Live updates active"
          />
        )}
      </div>
      <div className="flex items-center gap-2 mt-0.5">
        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};