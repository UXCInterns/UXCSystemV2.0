import React from "react";
import FilterSection from "./FilterSection";
import DateRangeFilter from "./DateRangeFilter";
import AttendanceRangeFilter from "./AttendanceRangeFilter";
import { FilterOptions } from "@/types/LearningJourneyAttendanceTypes/visit";

interface FilterGridProps {
  filters: FilterOptions;
  searchTerms: {
    sectors: string;
    industries: string;
    companySizes: string;
  };
  sectors: string[];
  industries: string[];
  organizationSizes: string[];
  sessionTypes: string[];
  onCheckboxChange: (
    category: keyof Pick<FilterOptions, 'sessionTypes' | 'sectors' | 'industries' | 'companySizes'>,
    value: string,
    checked: boolean
  ) => void;
  onSearchChange: (category: string, value: string) => void;
  onDateChange: (field: 'startDate' | 'endDate', value: string) => void;
  onAttendanceChange: (field: 'min' | 'max', value: string) => void;
}

const FilterGrid: React.FC<FilterGridProps> = ({
  filters,
  searchTerms,
  sectors,
  industries,
  organizationSizes,
  sessionTypes,
  onCheckboxChange,
  onSearchChange,
  onDateChange,
  onAttendanceChange,
}) => {
  return (
    <div className="overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          
          <FilterSection
            title="Sector"
            description="Organization sector type"
            options={sectors}
            selectedValues={filters.sectors}
            searchTerm={searchTerms.sectors}
            onSearchChange={(value) => onSearchChange('sectors', value)}
            onCheckboxChange={(value, checked) => onCheckboxChange('sectors', value, checked)}
            searchPlaceholder="Search sectors..."
          />

          <FilterSection
            title="Industry"
            description="Specific industry classification"
            options={industries}
            selectedValues={filters.industries}
            searchTerm={searchTerms.industries}
            onSearchChange={(value) => onSearchChange('industries', value)}
            onCheckboxChange={(value, checked) => onCheckboxChange('industries', value, checked)}
            searchPlaceholder="Search industries..."
          />

          <FilterSection
            title="Organization Size"
            description="Company size classification"
            options={organizationSizes}
            selectedValues={filters.companySizes}
            searchTerm={searchTerms.companySizes}
            onSearchChange={(value) => onSearchChange('companySizes', value)}
            onCheckboxChange={(value, checked) => onCheckboxChange('companySizes', value, checked)}
            searchPlaceholder="Search sizes..."
          />

          <DateRangeFilter
            startDate={filters.dateRange.startDate}
            endDate={filters.dateRange.endDate}
            onDateChange={onDateChange}
          />

          <AttendanceRangeFilter
            minAttended={filters.attendedRange.min}
            maxAttended={filters.attendedRange.max}
            onRangeChange={onAttendanceChange}
          />

          <FilterSection
            title="Session Type"
            description="Filter by session time"
            options={sessionTypes}
            selectedValues={filters.sessionTypes}
            onCheckboxChange={(value, checked) => onCheckboxChange('sessionTypes', value, checked)}
            showSearch={false}
          />

        </div>
      </div>
    </div>
  );
};

export default FilterGrid;