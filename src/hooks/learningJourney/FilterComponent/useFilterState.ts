import { useState, useEffect } from "react";
import { FilterOptions } from "@/types/LearningJourneyAttendanceTypes/visit";

export const useFilterState = (currentFilters: FilterOptions) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(currentFilters);
  const [searchTerms, setSearchTerms] = useState({
    sessionTypes: '',
    sectors: '',
    industries: '',
    companySizes: ''
  });

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleCheckboxChange = (
    category: keyof Pick<FilterOptions, 'sessionTypes' | 'sectors' | 'industries' | 'companySizes'>,
    value: string,
    checked: boolean
  ) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  const handleAttendedRangeChange = (field: 'min' | 'max', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      attendedRange: {
        ...prev.attendedRange,
        [field]: value === '' ? null : parseInt(value)
      }
    }));
  };

  const handleSearchChange = (category: string, value: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const resetFilters = () => {
    const emptyFilters: FilterOptions = {
      sessionTypes: [],
      sectors: [],
      industries: [],
      companySizes: [],
      dateRange: { startDate: '', endDate: '' },
      attendedRange: { min: null, max: null }
    };
    setLocalFilters(emptyFilters);
    setSearchTerms({
      sessionTypes: '',
      sectors: '',
      industries: '',
      companySizes: ''
    });
  };

  const getActiveFilterCount = () => {
    return (
      localFilters.sessionTypes.length +
      localFilters.sectors.length +
      localFilters.industries.length +
      localFilters.companySizes.length +
      (localFilters.dateRange.startDate ? 1 : 0) +
      (localFilters.dateRange.endDate ? 1 : 0) +
      (localFilters.attendedRange.min !== null ? 1 : 0) +
      (localFilters.attendedRange.max !== null ? 1 : 0)
    );
  };

  return {
    localFilters,
    searchTerms,
    handleCheckboxChange,
    handleDateRangeChange,
    handleAttendedRangeChange,
    handleSearchChange,
    resetFilters,
    getActiveFilterCount
  };
};