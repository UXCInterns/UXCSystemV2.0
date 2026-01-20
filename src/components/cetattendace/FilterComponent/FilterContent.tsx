import React from "react";
import { WorkshopFilterOptions, AvailableFilterOptions } from "@/types/WorkshopTypes/workshop";
import { CheckboxFilterSection } from "./CheckboxFilterSection";
import { CSCFilterSection } from "./CSCFilterSection";
import { DateRangeFilterSection } from "./DateRangeFilterSection";
import { RangeFilterSection } from "./RangeFilterSection";

interface FilterContentProps {
  programTypeFilter: "pace" | "non_pace";
  localFilters: WorkshopFilterOptions;
  searchTerms: {
    courseTypes: string;
    categories: string;
    biaLevels: string;
  };
  availableOptions: AvailableFilterOptions;
  onSearchChange: (category: string, value: string) => void;
  onCheckboxChange: (
    category: keyof Pick<WorkshopFilterOptions, "courseTypes" | "categories" | "biaLevels">,
    value: string,
    checked: boolean
  ) => void;
  onCSCToggle: (checked: boolean) => void;
  onDateRangeChange: (field: "startDate" | "endDate", value: string) => void;
  onRangeChange: (
    rangeType: "participantsRange" | "traineeHoursRange" | "courseHoursRange",
    field: "min" | "max",
    value: string
  ) => void;
  isMobile?: boolean;
}

export const FilterContent: React.FC<FilterContentProps> = ({
  programTypeFilter,
  localFilters,
  searchTerms,
  availableOptions,
  onSearchChange,
  onCheckboxChange,
  onCSCToggle,
  onDateRangeChange,
  onRangeChange,
  isMobile = false,
}) => {
  // Mobile Layout - Single Column
  if (isMobile) {
    return (
      <div className="space-y-6">
        {/* Course Type Filter */}
        <CheckboxFilterSection
          title="Course Type"
          description="Type of course delivery"
          category="courseTypes"
          options={availableOptions.courseTypes}
          searchPlaceholder="Search course types..."
          searchValue={searchTerms.courseTypes}
          selectedValues={localFilters.courseTypes}
          onSearchChange={(value) => onSearchChange("courseTypes", value)}
          onCheckboxChange={(value, checked) =>
            onCheckboxChange("courseTypes", value, checked)
          }
        />

        {/* Category Filter - PACE only */}
        {programTypeFilter === "pace" && (
          <CheckboxFilterSection
            title="Category"
            description="Workshop category (PACE)"
            category="categories"
            options={availableOptions.categories}
            searchPlaceholder="Search categories..."
            searchValue={searchTerms.categories}
            selectedValues={localFilters.categories}
            onSearchChange={(value) => onSearchChange("categories", value)}
            onCheckboxChange={(value, checked) =>
              onCheckboxChange("categories", value, checked)
            }
          />
        )}

        {/* BIA Level Filter */}
        <CheckboxFilterSection
          title="BIA Level"
          description="Business Impact Analysis level"
          category="biaLevels"
          options={availableOptions.biaLevels}
          searchPlaceholder="Search BIA levels..."
          searchValue={searchTerms.biaLevels}
          selectedValues={localFilters.biaLevels}
          onSearchChange={(value) => onSearchChange("biaLevels", value)}
          onCheckboxChange={(value, checked) =>
            onCheckboxChange("biaLevels", value, checked)
          }
        />

        {/* CSC Filter - Non-PACE only */}
        {programTypeFilter === "non_pace" && (
          <CSCFilterSection
            checked={localFilters.cscOnly}
            onChange={onCSCToggle}
          />
        )}

        {/* Date Range Filter */}
        <DateRangeFilterSection
          startDate={localFilters.dateRange.startDate}
          endDate={localFilters.dateRange.endDate}
          onStartDateChange={(value) => onDateRangeChange("startDate", value)}
          onEndDateChange={(value) => onDateRangeChange("endDate", value)}
        />

        {/* Participants Range Filter */}
        <RangeFilterSection
          title="Participants Range"
          description="Filter by number of participants"
          minValue={localFilters.participantsRange.min}
          maxValue={localFilters.participantsRange.max}
          minLabel="Minimum Participants"
          maxLabel="Maximum Participants"
          minPlaceholder="Min participants"
          maxPlaceholder="Max participants"
          minId="min-participants"
          maxId="max-participants"
          onMinChange={(value) => onRangeChange("participantsRange", "min", value)}
          onMaxChange={(value) => onRangeChange("participantsRange", "max", value)}
        />

        {/* Trainee Hours Range Filter */}
        <RangeFilterSection
          title="Trainee Hours Range"
          description="Filter by total trainee hours"
          minValue={localFilters.traineeHoursRange.min}
          maxValue={localFilters.traineeHoursRange.max}
          minLabel="Minimum Hours"
          maxLabel="Maximum Hours"
          minPlaceholder="Min hours"
          maxPlaceholder="Max hours"
          minId="min-trainee-hours"
          maxId="max-trainee-hours"
          onMinChange={(value) => onRangeChange("traineeHoursRange", "min", value)}
          onMaxChange={(value) => onRangeChange("traineeHoursRange", "max", value)}
        />

        {/* Course Hours Range Filter */}
        <RangeFilterSection
          title="Course Hours Range"
          description="Filter by course duration"
          minValue={localFilters.courseHoursRange.min}
          maxValue={localFilters.courseHoursRange.max}
          minLabel="Minimum Hours"
          maxLabel="Maximum Hours"
          minPlaceholder="Min hours"
          maxPlaceholder="Max hours"
          minId="min-course-hours"
          maxId="max-course-hours"
          onMinChange={(value) => onRangeChange("courseHoursRange", "min", value)}
          onMaxChange={(value) => onRangeChange("courseHoursRange", "max", value)}
        />
      </div>
    );
  }

  // Desktop Layout - Multi-Column Grid
  return (
    <div className="overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Course Type Filter */}
          <CheckboxFilterSection
            title="Course Type"
            description="Type of course delivery"
            category="courseTypes"
            options={availableOptions.courseTypes}
            searchPlaceholder="Search course types..."
            searchValue={searchTerms.courseTypes}
            selectedValues={localFilters.courseTypes}
            onSearchChange={(value) => onSearchChange("courseTypes", value)}
            onCheckboxChange={(value, checked) =>
              onCheckboxChange("courseTypes", value, checked)
            }
          />

          {/* Category Filter - PACE only */}
          {programTypeFilter === "pace" && (
            <CheckboxFilterSection
              title="Category"
              description="Workshop category (PACE)"
              category="categories"
              options={availableOptions.categories}
              searchPlaceholder="Search categories..."
              searchValue={searchTerms.categories}
              selectedValues={localFilters.categories}
              onSearchChange={(value) => onSearchChange("categories", value)}
              onCheckboxChange={(value, checked) =>
                onCheckboxChange("categories", value, checked)
              }
            />
          )}

          {/* BIA Level Filter */}
          <CheckboxFilterSection
            title="BIA Level"
            description="Business Impact Analysis level"
            category="biaLevels"
            options={availableOptions.biaLevels}
            searchPlaceholder="Search BIA levels..."
            searchValue={searchTerms.biaLevels}
            selectedValues={localFilters.biaLevels}
            onSearchChange={(value) => onSearchChange("biaLevels", value)}
            onCheckboxChange={(value, checked) =>
              onCheckboxChange("biaLevels", value, checked)
            }
          />

          {/* CSC Filter - Non-PACE only */}
          {programTypeFilter === "non_pace" && (
            <CSCFilterSection
              checked={localFilters.cscOnly}
              onChange={onCSCToggle}
            />
          )}

          {/* Date Range Filter */}
          <DateRangeFilterSection
            startDate={localFilters.dateRange.startDate}
            endDate={localFilters.dateRange.endDate}
            onStartDateChange={(value) => onDateRangeChange("startDate", value)}
            onEndDateChange={(value) => onDateRangeChange("endDate", value)}
          />

          {/* Participants Range Filter */}
          <RangeFilterSection
            title="Participants Range"
            description="Filter by number of participants"
            minValue={localFilters.participantsRange.min}
            maxValue={localFilters.participantsRange.max}
            minLabel="Minimum Participants"
            maxLabel="Maximum Participants"
            minPlaceholder="Min participants"
            maxPlaceholder="Max participants"
            minId="min-participants"
            maxId="max-participants"
            onMinChange={(value) => onRangeChange("participantsRange", "min", value)}
            onMaxChange={(value) => onRangeChange("participantsRange", "max", value)}
          />

          {/* Trainee Hours Range Filter */}
          <RangeFilterSection
            title="Trainee Hours Range"
            description="Filter by total trainee hours"
            minValue={localFilters.traineeHoursRange.min}
            maxValue={localFilters.traineeHoursRange.max}
            minLabel="Minimum Hours"
            maxLabel="Maximum Hours"
            minPlaceholder="Min hours"
            maxPlaceholder="Max hours"
            minId="min-trainee-hours"
            maxId="max-trainee-hours"
            onMinChange={(value) => onRangeChange("traineeHoursRange", "min", value)}
            onMaxChange={(value) => onRangeChange("traineeHoursRange", "max", value)}
          />

          {/* Course Hours Range Filter */}
          <RangeFilterSection
            title="Course Hours Range"
            description="Filter by course duration"
            minValue={localFilters.courseHoursRange.min}
            maxValue={localFilters.courseHoursRange.max}
            minLabel="Minimum Hours"
            maxLabel="Maximum Hours"
            minPlaceholder="Min hours"
            maxPlaceholder="Max hours"
            minId="min-course-hours"
            maxId="max-course-hours"
            onMinChange={(value) => onRangeChange("courseHoursRange", "min", value)}
            onMaxChange={(value) => onRangeChange("courseHoursRange", "max", value)}
          />
        </div>
      </div>
    </div>
  );
};