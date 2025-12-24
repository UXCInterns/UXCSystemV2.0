import React from 'react';

interface TableStatsProps {
  currentCount: number;
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
}

const TableStats: React.FC<TableStatsProps> = ({
  currentCount,
  filteredCount,
  totalCount,
  hasActiveFilters,
}) => {
  return (
    <div className="px-3 pb-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Showing {currentCount} of {filteredCount} visits
        {hasActiveFilters && ` (filtered from ${totalCount} total)`}
      </span>
    </div>
  );
};

export default TableStats;