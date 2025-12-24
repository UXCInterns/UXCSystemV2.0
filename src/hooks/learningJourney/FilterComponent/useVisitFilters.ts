// hooks/useVisitFilters.ts
// This is for the UXC LJ Attendance Table

import { useMemo, useState } from 'react';
import { Visit, FilterOptions } from '../../../types/LearningJourneyAttendanceTypes/visit';

export const useVisitFilters = (visits: Visit[]) => {
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    sessionTypes: [],
    sectors: [],
    industries: [],
    companySizes: [],
    dateRange: { startDate: '', endDate: '' },
    attendedRange: { min: null, max: null }
  });

  const availableFilterOptions = useMemo(() => {
    if (!visits.length) {
      return {
        sessionTypes: [] as string[],
        sectors: [] as string[],
        industries: [] as string[],
        companySizes: [] as string[]
      };
    }

    return {
      sessionTypes: [...new Set(visits.map(item => item.session_type))].filter(Boolean).sort(),
      sectors: [...new Set(visits.map(item => item.sector))].filter(Boolean).sort(),
      industries: [...new Set(visits.map(item => item.industry))].filter(Boolean).sort(),
      companySizes: [...new Set(visits.map(item => item.size))].filter(Boolean).sort()
    };
  }, [visits]);

  const applyFilters = (data: Visit[], filters: FilterOptions): Visit[] => {
    return data.filter((item: Visit) => {
      if (filters.sessionTypes.length > 0 && !filters.sessionTypes.includes(item.session_type)) {
        return false;
      }

      if (filters.sectors.length > 0 && !filters.sectors.includes(item.sector)) {
        return false;
      }

      if (filters.industries.length > 0 && !filters.industries.includes(item.industry)) {
        return false;
      }

      if (filters.companySizes.length > 0 && !filters.companySizes.includes(item.size)) {
        return false;
      }

      if (filters.dateRange.startDate || filters.dateRange.endDate) {
        const itemDate = new Date(item.date_of_visit);
        
        if (filters.dateRange.startDate) {
          const startDate = new Date(filters.dateRange.startDate);
          if (itemDate < startDate) return false;
        }
        
        if (filters.dateRange.endDate) {
          const endDate = new Date(filters.dateRange.endDate);
          if (itemDate > endDate) return false;
        }
      }

      if (filters.attendedRange.min !== null && item.total_attended < filters.attendedRange.min) {
        return false;
      }
      
      if (filters.attendedRange.max !== null && item.total_attended > filters.attendedRange.max) {
        return false;
      }

      return true;
    });
  };

  // Fix: Ensure this returns a boolean
  const hasActiveFilters: boolean = useMemo(() => {
    return Boolean(
      activeFilters.sessionTypes.length > 0 ||
      activeFilters.sectors.length > 0 ||
      activeFilters.industries.length > 0 ||
      activeFilters.companySizes.length > 0 ||
      activeFilters.dateRange.startDate ||
      activeFilters.dateRange.endDate ||
      activeFilters.attendedRange.min !== null ||
      activeFilters.attendedRange.max !== null
    );
  }, [activeFilters]);

  // Fix: Ensure this returns a number
  const activeFilterCount: number = useMemo(() => {
    let count = 0;
    if (activeFilters.sessionTypes.length > 0) count++;
    if (activeFilters.sectors.length > 0) count++;
    if (activeFilters.industries.length > 0) count++;
    if (activeFilters.companySizes.length > 0) count++;
    if (activeFilters.dateRange.startDate || activeFilters.dateRange.endDate) count++;
    if (activeFilters.attendedRange.min !== null || activeFilters.attendedRange.max !== null) count++;
    return count;
  }, [activeFilters]);

  const clearFilters = () => {
    setActiveFilters({
      sessionTypes: [],
      sectors: [],
      industries: [],
      companySizes: [],
      dateRange: { startDate: '', endDate: '' },
      attendedRange: { min: null, max: null }
    });
  };

  return {
    activeFilters,
    setActiveFilters,
    availableFilterOptions,
    applyFilters,
    hasActiveFilters, // Now explicitly typed as boolean
    activeFilterCount, // Now explicitly typed as number
    clearFilters,
  };
};