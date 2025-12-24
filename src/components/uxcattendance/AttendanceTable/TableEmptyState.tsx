import React from 'react';
import { TableRow } from "@/components/ui/table";

interface TableEmptyStateProps {
  isLoading: boolean;
  hasData: boolean;
  hasActiveFilters: boolean;
  searchQuery: string;
}

const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  isLoading,
  hasData,
  hasActiveFilters,
  searchQuery,
}) => {
  if (isLoading) {
    return (
      <TableRow>
        <td colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
            <span className="ml-2">Loading workshops...</span>
          </div>
        </td>
      </TableRow>
    );
  }

  if (!hasData) {
    return (
      <TableRow>
        <td colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
          {hasActiveFilters || searchQuery 
            ? "No visits match your current filters or search criteria." 
            : "No visits found."
          }
        </td>
      </TableRow>
    );
  }

  return null;
};

export default TableEmptyState;