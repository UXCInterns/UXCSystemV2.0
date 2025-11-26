import React from 'react';
import SearchQuery from "@/components/attendance/common/SearchQuery";
import SortDropdown from "@/components/attendance/common/SortDropdown";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";

interface VisitTableHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  sortOptions: string[];
  onSortChange: (sort: string) => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onFilterClick: () => void;
  onAddVisitClick: () => void;
  isLoading: boolean;
}

export const VisitTableHeader: React.FC<VisitTableHeaderProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  sortOptions,
  onSortChange,
  hasActiveFilters,
  activeFilterCount,
  onFilterClick,
  onAddVisitClick,
  isLoading,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-4">
      <div className="flex items-center">
        <SearchQuery value={searchQuery} onChange={onSearchChange} />
      </div>
      <div className="flex items-center gap-4">
        <Button 
          size="sm" 
          className="px-4 py-2.5 relative" 
          variant={hasActiveFilters ? "primary" : "outline"}
          onClick={onFilterClick}
        >
          <svg
            className="stroke-current fill-white dark:fill-gray-800"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
              d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
              strokeWidth="1.5"
            />
            <path
              d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
              strokeWidth="1.5"
            />
          </svg>
          Filter
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <SortDropdown
          options={sortOptions}
          selected={sortBy}
          onSelect={onSortChange}
        />
        <Button 
          className="flex items-center px-4 py-2.5 disabled:opacity-50" 
          variant="primary"
          size="sm"
          onClick={onAddVisitClick}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Log New Visit"} <PlusIcon className="ml-2" />
        </Button>
      </div>
    </div>
  );
};
