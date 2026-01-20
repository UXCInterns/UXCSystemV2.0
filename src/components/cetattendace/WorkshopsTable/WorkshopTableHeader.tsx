import React from 'react';
import SearchQuery from "@/components/common/SearchQuery";
import SortDropdown from "@/components/common/SortDropdown";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { WorkshopTableHeaderProps } from '@/types/WorkshopTypes/workshop';
import { SORT_OPTIONS } from '@/constants/WorkshopAttendanceConstants/workshopConstants';

const WorkshopTableHeader: React.FC<WorkshopTableHeaderProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  activeFilterCount,
  onFilterClick,
  onAddClick,
  isLoading
}) => {
  return (
    <div className="p-3 space-y-3">
      {/* Desktop Layout - Hidden on Mobile */}
      <div className="hidden md:flex items-center justify-between gap-4">
        <div className="flex items-center">
          <SearchQuery value={searchQuery} onChange={onSearchChange} placeholder='Search by program name...'/>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="px-4 py-3 relative" 
            variant="outline"
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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <SortDropdown options={SORT_OPTIONS} selected={sortBy} onSelect={onSortChange} />
          <Button
            onClick={onAddClick}
            disabled={isLoading}
            endIcon={<PlusIcon />}
            className="text-theme-sm"
          >
            Add New Workshop
          </Button>
        </div>
      </div>

      {/* Mobile Layout - Visible only on Mobile */}
      <div className="md:hidden space-y-3">
        {/* Search Bar - Full Width */}
        <div className="w-full">
          <SearchQuery value={searchQuery} onChange={onSearchChange} placeholder='Search program...'/>
        </div>
        
        {/* Filter and Sort Row */}
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="px-3 py-3 relative flex-1" 
            variant="outline"
            onClick={onFilterClick}
          >
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="18"
              height="18"
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
            <span className="ml-2">Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <div className="flex-1">
            <SortDropdown options={SORT_OPTIONS} selected={sortBy} onSelect={onSortChange} />
          </div>
        </div>

        {/* Add Workshop Button - Full Width */}
        <Button
          onClick={onAddClick}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-3 py-2"
        >
          <PlusIcon className="mr-1.5" />
          <span>Add New Workshop</span>
        </Button>
      </div>
    </div>
  );
};

export default WorkshopTableHeader;