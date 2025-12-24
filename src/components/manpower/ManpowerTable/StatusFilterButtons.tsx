import React from "react";
import { StatusFilter } from "@/types/ManpowerTypes/manpower";
import Button from "@/components/ui/button/Button"; // adjust path if needed

interface StatusFilterButtonsProps {
  statusFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

export const StatusFilterButtons = ({
  statusFilter,
  onFilterChange,
}: StatusFilterButtonsProps) => {
  const filters: StatusFilter[] = ["All", "Available", "Busy", "Overloaded"];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
        Filter by status:
      </span>

      {filters.map((filter) => (
        <Button
          key={filter}
          size="sm"
          variant={statusFilter === filter ? "primary" : "outline"}
          onClick={() => onFilterChange(filter)}
        >
          {filter}
        </Button>
      ))}
    </div>
  );
};
