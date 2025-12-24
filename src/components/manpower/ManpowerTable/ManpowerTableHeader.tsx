// Header section of the manpower table with title and filters
import React from "react";
import { StatusFilter } from "@/types/ManpowerTypes/manpower";
import { StatusFilterButtons } from "./StatusFilterButtons";

interface ManpowerTableHeaderProps {
  statusFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

export const ManpowerTableHeader = ({ 
  statusFilter, 
  onFilterChange 
}: ManpowerTableHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/[0.05]">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
        Manpower Allocation
      </h4>
      <StatusFilterButtons 
        statusFilter={statusFilter} 
        onFilterChange={onFilterChange} 
      />
    </div>
  );
};