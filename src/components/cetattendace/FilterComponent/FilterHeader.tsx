import React from "react";

interface FilterHeaderProps {
  programTypeFilter: "pace" | "non_pace";
  activeFilterCount: number;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  programTypeFilter,
  activeFilterCount,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Filter {programTypeFilter.toUpperCase()} Workshops
        </h2>
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {activeFilterCount} active
          </span>
        )}
      </div>
    </div>
  );
};