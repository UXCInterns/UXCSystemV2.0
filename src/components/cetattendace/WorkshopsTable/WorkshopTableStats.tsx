import React from "react";
import { WorkshopTableStatsProps } from "@/types/WorkshopTypes/workshop";

export const WorkshopTableStats: React.FC<WorkshopTableStatsProps> = ({
  paginatedCount,
  sortedCount,
  filteredByTypeCount,
  programTypeFilter,
  searchQuery,
  hasActiveFilters
}) => {
  const programType = programTypeFilter.toUpperCase();
  const showFilteredInfo = searchQuery || hasActiveFilters;

  return (
    <div className="px-3 pb-2">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Showing {paginatedCount} of {sortedCount} {programType} workshops
        {showFilteredInfo && ` (filtered from ${filteredByTypeCount} total ${programType})`}
      </span>
    </div>
  );
};