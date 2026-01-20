import { useState, useEffect } from "react";
import { WorkshopFilterOptions } from "@/types/WorkshopTypes/workshop";

export const useWorkshopFilter = (
  currentFilters: WorkshopFilterOptions,
  programTypeFilter: "pace" | "non_pace"
) => {
  const [localFilters, setLocalFilters] = useState<WorkshopFilterOptions>(currentFilters);
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
        newFilters.cscOnly = false;
      } else if (programTypeFilter === "non_pace") {
        newFilters.categories = [];
      }
      
      return newFilters;
    });
  }, [programTypeFilter]);

  const handleCheckboxChange = (
    category: keyof Pick<WorkshopFilterOptions, "courseTypes" | "categories" | "biaLevels">,
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

  const clearAllFilters = () => {
    const emptyFilters: WorkshopFilterOptions = {
      programTypes: [],
      schoolDepts: [],
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

  return {
    localFilters,
    searchTerms,
    handleCheckboxChange,
    handleDateRangeChange,
    handleRangeChange,
    handleCSCToggle,
    handleSearchChange,
    clearAllFilters,
    getActiveFilterCount,
  };
};