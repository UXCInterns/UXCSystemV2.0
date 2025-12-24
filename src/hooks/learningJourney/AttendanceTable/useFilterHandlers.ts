import { useCallback } from 'react';
import { FilterState } from '@/types/LearningJourneyAttendanceTypes/visit';

interface FilterHandlersProps {
  setActiveFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clearFilters: () => void;
  setCurrentPage: (page: number) => void;
}

export const useFilterHandlers = ({
  setActiveFilters,
  clearFilters,
  setCurrentPage,
}: FilterHandlersProps) => {
  
  const handleApplyFilters = useCallback((filters: FilterState) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  }, [setActiveFilters, setCurrentPage]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setCurrentPage(1);
  }, [clearFilters, setCurrentPage]);

  const handleRemoveFilter = useCallback((filterType: string, value?: string) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      
      switch (filterType) {
        case 'sessionTypes':
          updated.sessionTypes = prev.sessionTypes.filter(t => t !== value);
          break;
        case 'sectors':
          updated.sectors = prev.sectors.filter(s => s !== value);
          break;
        case 'industries':
          updated.industries = prev.industries.filter(i => i !== value);
          break;
        case 'companySizes':
          updated.companySizes = prev.companySizes.filter(s => s !== value);
          break;
        case 'dateRange':
          updated.dateRange = { startDate: '', endDate: '' };
          break;
        case 'attendedRange':
          updated.attendedRange = { min: null, max: null };
          break;
      }
      
      return updated;
    });
  }, [setActiveFilters]);

  return {
    handleApplyFilters,
    handleClearFilters,
    handleRemoveFilter,
  };
};