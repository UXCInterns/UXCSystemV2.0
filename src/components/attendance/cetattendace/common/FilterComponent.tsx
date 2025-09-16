"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import { Modal } from "@/components/ui/modal/index";
import {
  COURSE_TYPES,
  BIA_LEVELS,
  PACE_CATEGORIES,
} from "@/hooks/workshop/useWorkshopOptions";

export interface WorkshopFilterOptions {
  programTypes: string[];
  schoolDepts: string[]; // no longer used in UI
  courseTypes: string[];
  categories: string[]; // for PACE workshops
  biaLevels: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  participantsRange: {
    min: number | null;
    max: number | null;
  };
  traineeHoursRange: {
    min: number | null;
    max: number | null;
  };
  courseHoursRange: {
    min: number | null;
    max: number | null;
  };
  cscOnly: boolean; // for non-PACE workshops
}

export interface WorkshopFilterComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: WorkshopFilterOptions) => void;
  onClearFilters: () => void;
  currentFilters: WorkshopFilterOptions;
  availableOptions: {
    programTypes: string[];
    courseTypes: string[];
    categories: string[];
    biaLevels: string[];
  };
  programTypeFilter: "pace" | "non_pace"; // Add this prop to determine which filters to show
}

const WorkshopFilterComponent: React.FC<WorkshopFilterComponentProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
  availableOptions,
  programTypeFilter,
}) => {
  const [localFilters, setLocalFilters] =
    useState<WorkshopFilterOptions>(currentFilters);
  const [searchTerms, setSearchTerms] = useState({
    courseTypes: "",
    categories: "",
    biaLevels: "",
  });

  // Update local filters when current filters change
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Clear irrelevant filters when program type changes
  useEffect(() => {
    setLocalFilters(prev => {
      const newFilters = { ...prev };
      
      if (programTypeFilter === "pace") {
        // Clear CSC filter when switching to PACE
        newFilters.cscOnly = false;
      } else if (programTypeFilter === "non_pace") {
        // Clear categories when switching to Non-PACE
        newFilters.categories = [];
      }
      
      return newFilters;
    });
  }, [programTypeFilter]);

  // Helper function to get display label
  const getDisplayLabel = (category: string, value: string): string => {
    switch (category) {
      case "courseTypes":
        return COURSE_TYPES.includes(value) ? value : value;
      case "categories":
        return PACE_CATEGORIES.includes(value) ? value : value;
      case "biaLevels":
        return BIA_LEVELS.includes(value) ? value : value;
      default:
        return value;
    }
  };

  const handleCheckboxChange = (
    category: keyof Pick<
      WorkshopFilterOptions,
      "courseTypes" | "categories" | "biaLevels"
    >,
    value: string,
    checked: boolean
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter((item) => item !== value),
    }));
  };

  const handleDateRangeChange = (field: "startDate" | "endDate", value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }));
  };

  const handleRangeChange = (
    rangeType: "participantsRange" | "traineeHoursRange" | "courseHoursRange",
    field: "min" | "max",
    value: string
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [rangeType]: {
        ...prev[rangeType],
        [field]: value === "" ? null : parseInt(value),
      },
    }));
  };

  const handleCSCToggle = (checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      cscOnly: checked,
    }));
  };

  const handleSearchChange = (category: string, value: string) => {
    setSearchTerms((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const filterOptions = (options: string[], searchTerm: string, category?: string) => {
    if (!searchTerm) return options;

    return options.filter((option) => {
      const displayLabel = category ? getDisplayLabel(category, option) : option;
      return displayLabel.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: WorkshopFilterOptions = {
      programTypes: [],
      schoolDepts: [], // no longer used
      courseTypes: [],
      categories: [],
      biaLevels: [],
      dateRange: { startDate: "", endDate: "" },
      participantsRange: { min: null, max: null },
      traineeHoursRange: { min: null, max: null },
      courseHoursRange: { min: null, max: null },
      cscOnly: false,
    };
    setLocalFilters(emptyFilters);
    setSearchTerms({
      courseTypes: "",
      categories: "",
      biaLevels: "",
    });
    onClearFilters();
  };

  const getActiveFilterCount = () => {
    const count =
      localFilters.courseTypes.length +
      localFilters.categories.length +
      localFilters.biaLevels.length +
      (localFilters.dateRange.startDate ? 1 : 0) +
      (localFilters.dateRange.endDate ? 1 : 0) +
      (localFilters.participantsRange.min !== null ? 1 : 0) +
      (localFilters.participantsRange.max !== null ? 1 : 0) +
      (localFilters.traineeHoursRange.min !== null ? 1 : 0) +
      (localFilters.traineeHoursRange.max !== null ? 1 : 0) +
      (localFilters.courseHoursRange.min !== null ? 1 : 0) +
      (localFilters.courseHoursRange.max !== null ? 1 : 0) +
      (localFilters.cscOnly ? 1 : 0);
    return count;
  };

  const renderFilterSection = (
    title: string,
    description: string,
    category: keyof typeof searchTerms,
    options: string[],
    searchPlaceholder: string
  ) => (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </Label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerms[category]}
          onChange={(e) => handleSearchChange(category, e.target.value)}
          className="mb-3"
        />
        <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
          {filterOptions(options, searchTerms[category], category).map((option) => (
            <Checkbox
              key={option}
              label={getDisplayLabel(category, option)}
              checked={localFilters[category].includes(option)}
              onChange={(checked) => handleCheckboxChange(category, option, checked)}
            />
          ))}
          {filterOptions(options, searchTerms[category], category).length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
              No options found matching "{searchTerms[category]}"
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Filter {programTypeFilter.toUpperCase()} Workshops
          </h2>
          {getActiveFilterCount() > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
      </div>

      {/* Filter Content */}
      <div className="overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            
            {/* Course Type Filter - Always shown */}
            {renderFilterSection(
              "Course Type",
              "Type of course delivery",
              "courseTypes",
              availableOptions.courseTypes,
              "Search course types..."
            )}

            {/* Category Filter - Only show for PACE workshops */}
            {programTypeFilter === "pace" && renderFilterSection(
              "Category",
              "Workshop category (PACE)",
              "categories",
              availableOptions.categories,
              "Search categories..."
            )}

            {/* BIA Level Filter - Always shown */}
            {renderFilterSection(
              "BIA Level",
              "Business Impact Analysis level",
              "biaLevels",
              availableOptions.biaLevels,
              "Search BIA levels..."
            )}

            {/* CSC Filter - Only show for Non-PACE workshops */}
            {programTypeFilter === "non_pace" && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold text-gray-900 dark:text-white">
                    CSC Programs
                  </Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Civil Service College programs only
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <Checkbox
                    label="Show CSC programs only"
                    checked={localFilters.cscOnly}
                    onChange={handleCSCToggle}
                  />
                </div>
              </div>
            )}

            {/* Date Range Filter - Always shown */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Program Date Range
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Filter by program start dates
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                <div>
                  <Label
                    htmlFor="start-date"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    From Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={localFilters.dateRange.startDate}
                    onChange={(e) =>
                      handleDateRangeChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="end-date"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    To Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={localFilters.dateRange.endDate}
                    onChange={(e) =>
                      handleDateRangeChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Participants Range Filter - Always shown */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Participants Range
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Filter by number of participants
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                <div>
                  <Label
                    htmlFor="min-participants"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Minimum Participants
                  </Label>
                  <Input
                    id="min-participants"
                    type="number"
                    min="0"
                    value={localFilters.participantsRange.min || ""}
                    onChange={(e) =>
                      handleRangeChange("participantsRange", "min", e.target.value)
                    }
                    placeholder="Min participants"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="max-participants"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Maximum Participants
                  </Label>
                  <Input
                    id="max-participants"
                    type="number"
                    min="0"
                    value={localFilters.participantsRange.max || ""}
                    onChange={(e) =>
                      handleRangeChange("participantsRange", "max", e.target.value)
                    }
                    placeholder="Max participants"
                  />
                </div>
              </div>
            </div>

            {/* Trainee Hours Range Filter - Always shown */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Trainee Hours Range
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Filter by total trainee hours
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                <div>
                  <Label
                    htmlFor="min-trainee-hours"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Minimum Hours
                  </Label>
                  <Input
                    id="min-trainee-hours"
                    type="number"
                    min="0"
                    value={localFilters.traineeHoursRange.min || ""}
                    onChange={(e) =>
                      handleRangeChange("traineeHoursRange", "min", e.target.value)
                    }
                    placeholder="Min hours"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="max-trainee-hours"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Maximum Hours
                  </Label>
                  <Input
                    id="max-trainee-hours"
                    type="number"
                    min="0"
                    value={localFilters.traineeHoursRange.max || ""}
                    onChange={(e) =>
                      handleRangeChange("traineeHoursRange", "max", e.target.value)
                    }
                    placeholder="Max hours"
                  />
                </div>
              </div>
            </div>

            {/* Course Hours Range Filter - Always shown */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Course Hours Range
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Filter by course duration
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                <div>
                  <Label
                    htmlFor="min-course-hours"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Minimum Hours
                  </Label>
                  <Input
                    id="min-course-hours"
                    type="number"
                    min="0"
                    value={localFilters.courseHoursRange.min || ""}
                    onChange={(e) =>
                      handleRangeChange("courseHoursRange", "min", e.target.value)
                    }
                    placeholder="Min hours"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="max-course-hours"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Maximum Hours
                  </Label>
                  <Input
                    id="max-course-hours"
                    type="number"
                    min="0"
                    value={localFilters.courseHoursRange.max || ""}
                    onChange={(e) =>
                      handleRangeChange("courseHoursRange", "max", e.target.value)
                    }
                    placeholder="Max hours"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="px-4 py-2.5"
        >
          Clear All Filters
        </Button>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="px-4 py-2.5"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            className="px-4 py-2.5"
          >
            Apply Filters ({getActiveFilterCount()})
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WorkshopFilterComponent;