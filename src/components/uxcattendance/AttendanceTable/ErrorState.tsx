import React from 'react';

interface ErrorStateProps {
  error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error loading visits: {error.message}</div>
      </div>
    </div>
  );
};

export default ErrorState;