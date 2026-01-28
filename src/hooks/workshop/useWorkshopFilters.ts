// hooks/useWorkshopFilters.ts
// Custom hook for filtering CET Training workshops

import { useMemo, useState } from 'react';
import { PROGRAM_TYPES, COURSE_TYPES, BIA_LEVELS, PACE_CATEGORIES } from "@/hooks/workshop/useWorkshopOptions";
import { Workshop } from "@/types/WorkshopTypes/workshop";

export interface WorkshopFilterOptions {
  programTypes: string[];
  schoolDepts: string[];
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

export const useWorkshopFilters = (_workshops: Workshop[]) => {
  const [activeFilters, setActiveFilters] = useState<WorkshopFilterOptions>({
    programTypes: [],
    schoolDepts: [],
    courseTypes: [],
    categories: [],
    biaLevels: [],
    dateRange: { startDate: '', endDate: '' },
    participantsRange: { min: null, max: null },
    traineeHoursRange: { min: null, max: null },
    courseHoursRange: { min: null, max: null },
    cscOnly: false
  });

  // Transform constants to match database values
  const PROGRAM_TYPE_VALUES = useMemo(() => 
    PROGRAM_TYPES.map(type => type.toLowerCase().replace("-", "_")),
    []
  );

  // Use predefined constants for available options instead of deriving from data
  const availableFilterOptions = useMemo(() => {
    return {
      programTypes: PROGRAM_TYPE_VALUES,
      schoolDepts: [] as string[], // Keep empty since not used in UI
      courseTypes: COURSE_TYPES, // Use all predefined course types
      categories: PACE_CATEGORIES, // Use all predefined PACE categories
      biaLevels: BIA_LEVELS // Use all predefined BIA levels
    };
  }, [PROGRAM_TYPE_VALUES]);

  const applyFilters = (data: Workshop[], filters: WorkshopFilterOptions): Workshop[] => {
    return data.filter((item: Workshop) => {
      // Program Type filter
      if (filters.programTypes.length > 0 && !filters.programTypes.includes(item.program_type)) {
        return false;
      }

      // School Department filter
      if (filters.schoolDepts.length > 0 && !filters.schoolDepts.includes(item.school_dept)) {
        return false;
      }

      // Course Type filter
      if (filters.courseTypes.length > 0 && item.course_type && !filters.courseTypes.includes(item.course_type)) {
        return false;
      }

      // Category filter (for PACE workshops)
      if (filters.categories.length > 0 && item.category && !filters.categories.includes(item.category)) {
        return false;
      }

      // BIA Level filter
      if (filters.biaLevels.length > 0 && item.bia_level && !filters.biaLevels.includes(item.bia_level)) {
        return false;
      }

      // CSC Only filter (for non-PACE workshops)
      if (filters.cscOnly && !item.csc) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.startDate || filters.dateRange.endDate) {
        const itemDate = new Date(item.program_start_date);
        
        if (filters.dateRange.startDate) {
          const startDate = new Date(filters.dateRange.startDate);
          if (itemDate < startDate) return false;
        }
        
        if (filters.dateRange.endDate) {
          const endDate = new Date(filters.dateRange.endDate);
          if (itemDate > endDate) return false;
        }
      }

      // Participants range filter
      if (filters.participantsRange.min !== null && item.no_of_participants < filters.participantsRange.min) {
        return false;
      }
      
      if (filters.participantsRange.max !== null && item.no_of_participants > filters.participantsRange.max) {
        return false;
      }

      // Trainee hours range filter
      if (filters.traineeHoursRange.min !== null && item.trainee_hours < filters.traineeHoursRange.min) {
        return false;
      }
      
      if (filters.traineeHoursRange.max !== null && item.trainee_hours > filters.traineeHoursRange.max) {
        return false;
      }

      // Course hours range filter
      if (filters.courseHoursRange.min !== null && item.course_hours < filters.courseHoursRange.min) {
        return false;
      }
      
      if (filters.courseHoursRange.max !== null && item.course_hours > filters.courseHoursRange.max) {
        return false;
      }

      return true;
    });
  };

  const hasActiveFilters: boolean = useMemo(() => {
    return Boolean(
      activeFilters.programTypes.length > 0 ||
      activeFilters.schoolDepts.length > 0 ||
      activeFilters.courseTypes.length > 0 ||
      activeFilters.categories.length > 0 ||
      activeFilters.biaLevels.length > 0 ||
      activeFilters.dateRange.startDate ||
      activeFilters.dateRange.endDate ||
      activeFilters.participantsRange.min !== null ||
      activeFilters.participantsRange.max !== null ||
      activeFilters.traineeHoursRange.min !== null ||
      activeFilters.traineeHoursRange.max !== null ||
      activeFilters.courseHoursRange.min !== null ||
      activeFilters.courseHoursRange.max !== null ||
      activeFilters.cscOnly
    );
  }, [activeFilters]);

  const activeFilterCount: number = useMemo(() => {
    let count = 0;
    if (activeFilters.programTypes.length > 0) count++;
    if (activeFilters.schoolDepts.length > 0) count++;
    if (activeFilters.courseTypes.length > 0) count++;
    if (activeFilters.categories.length > 0) count++;
    if (activeFilters.biaLevels.length > 0) count++;
    if (activeFilters.dateRange.startDate || activeFilters.dateRange.endDate) count++;
    if (activeFilters.participantsRange.min !== null || activeFilters.participantsRange.max !== null) count++;
    if (activeFilters.traineeHoursRange.min !== null || activeFilters.traineeHoursRange.max !== null) count++;
    if (activeFilters.courseHoursRange.min !== null || activeFilters.courseHoursRange.max !== null) count++;
    if (activeFilters.cscOnly) count++;
    return count;
  }, [activeFilters]);

  const clearFilters = () => {
    setActiveFilters({
      programTypes: [],
      schoolDepts: [],
      courseTypes: [],
      categories: [],
      biaLevels: [],
      dateRange: { startDate: '', endDate: '' },
      participantsRange: { min: null, max: null },
      traineeHoursRange: { min: null, max: null },
      courseHoursRange: { min: null, max: null },
      cscOnly: false
    });
  };

  const removeFilter = (filterType: string, value?: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'programTypes':
          if (value) {
            newFilters.programTypes = prev.programTypes.filter(item => item !== value);
          }
          break;
        case 'schoolDepts':
          if (value) {
            newFilters.schoolDepts = prev.schoolDepts.filter(item => item !== value);
          }
          break;
        case 'courseTypes':
          if (value) {
            newFilters.courseTypes = prev.courseTypes.filter(item => item !== value);
          }
          break;
        case 'categories':
          if (value) {
            newFilters.categories = prev.categories.filter(item => item !== value);
          }
          break;
        case 'biaLevels':
          if (value) {
            newFilters.biaLevels = prev.biaLevels.filter(item => item !== value);
          }
          break;
        case 'cscOnly':
          newFilters.cscOnly = false;
          break;
        case 'dateRange':
          newFilters.dateRange = { startDate: '', endDate: '' };
          break;
        case 'participantsRange':
          newFilters.participantsRange = { min: null, max: null };
          break;
        case 'traineeHoursRange':
          newFilters.traineeHoursRange = { min: null, max: null };
          break;
        case 'courseHoursRange':
          newFilters.courseHoursRange = { min: null, max: null };
          break;
      }
      
      return newFilters;
    });
  };

  // Helper function to get display labels for filter values
  const getDisplayLabel = (category: string, value: string): string => {
    switch (category) {
      case 'programTypes':
        // Convert database value back to display format
        const programType = PROGRAM_TYPES.find(type => 
          type.toLowerCase().replace("-", "_") === value
        );
        return programType || value;
      case 'courseTypes':
        return COURSE_TYPES.includes(value) ? value : value;
      case 'categories':
        return PACE_CATEGORIES.includes(value) ? value : value;
      case 'biaLevels':
        return BIA_LEVELS.includes(value) ? value : value;
      default:
        return value;
    }
  };

  return {
    activeFilters,
    setActiveFilters,
    availableFilterOptions,
    applyFilters,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
    removeFilter,
    getDisplayLabel,
  };
};