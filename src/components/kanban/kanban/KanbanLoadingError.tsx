import React from 'react';
import Button from '@/components/ui/button/Button';

interface KanbanLoadingProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: React.ReactNode;
}

export default function KanbanLoadingError({
  loading,
  error,
  onRetry,
  children
}: KanbanLoadingProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] p-6">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={onRetry} variant="primary" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}