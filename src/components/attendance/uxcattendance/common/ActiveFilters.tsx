import React from 'react';
import { FilterOptions } from '@/types/visit';
import Badge from '@/components/ui/badge/Badge';
import { PlusIcon } from '@/icons';

interface ActiveFiltersProps {
  filters: FilterOptions;
  onRemoveFilter: (filterType: string, value?: string) => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  const hasActiveFilters = 
    filters.sessionTypes.length > 0 ||
    filters.sectors.length > 0 ||
    filters.industries.length > 0 ||
    filters.companySizes.length > 0 ||
    filters.dateRange.startDate ||
    filters.dateRange.endDate ||
    filters.attendedRange.min !== null ||
    filters.attendedRange.max !== null;

  if (!hasActiveFilters) return null;

  return (
    <div className="px-3 pb-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Active filters:
        </span>
        
        {filters.sessionTypes.map(type => (
          <Badge
            key={type}
            variant="light"
            color="primary"
            size="sm"
            endIcon={
              <PlusIcon onClick={() => onRemoveFilter('sessionTypes', type)} aria-label={`Remove ${type} filter`} className="rotate-45"/>
            }
          >
            Session: {type}
          </Badge>
        ))}
        
        {filters.sectors.map(sector => (
          <Badge
            key={sector}
            variant="light"
            color="success"
            size="sm"
            endIcon={
              <PlusIcon onClick={() => onRemoveFilter('sectors', sector)} aria-label={`Remove ${sector} filter`} className="rotate-45"/>
            }
          >
            Sector: {sector}
          </Badge>
        ))}
        
        {filters.industries.map(industry => (
          <Badge
            key={industry}
            variant="light"
            color="info"
            size="sm"
            endIcon={
             <PlusIcon onClick={() => onRemoveFilter('industries', industry)} aria-label={`Remove ${industry} filter`} className="rotate-45"/>
            }
          >
            Industry: {industry}
          </Badge>
        ))}
        
        {filters.companySizes.map(size => (
          <Badge
            key={size}
            variant="light"
            color="warning"
            size="sm"
            endIcon={
              <PlusIcon onClick={() => onRemoveFilter('companySizes', size)} aria-label={`Remove ${size} filter`} className="rotate-45"/>
            }
          >
            Size: {size}
          </Badge>
        ))}
        
        {(filters.dateRange.startDate || filters.dateRange.endDate) && (
          <Badge
            variant="light"
            color="info"
            size="sm"
            endIcon={
              <PlusIcon onClick={() => onRemoveFilter('dateRange')} aria-label="Remove date range filter" className="rotate-45"/>
            }
          >
            Date: {filters.dateRange.startDate || 'Start'} - {filters.dateRange.endDate || 'End'}
          </Badge>
        )}
        
        {(filters.attendedRange.min !== null || filters.attendedRange.max !== null) && (
          <Badge
            variant="light"
            color="dark"
            size="sm"
            endIcon={
              <PlusIcon onClick={() => onRemoveFilter('attendedRange')} aria-label="Remove attendance range filter" className="rotate-45"/>
            }
          >
            Attended: {filters.attendedRange.min || 0} - {filters.attendedRange.max || '∞'}
          </Badge>
        )}
        
        <button
          onClick={onClearAll}
          className="text-sm text-error-600 hover:text-error-800 dark:text-error-400 dark:hover:text-error-300 underline font-medium transition-colors"
        >
          Clear all
        </button>
      </div>
    </div>
  );
};