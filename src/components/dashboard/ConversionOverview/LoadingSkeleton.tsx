import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="relative w-full [perspective:1000px] animate-pulse">
      <div className="inset-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] w-full mx-auto">
        <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="mb-6 flex flex-col gap-2 p-4 bg-gray-100 dark:bg-white/3 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="flex flex-col gap-2">
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="flex flex-col w-24 gap-2">
                <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};