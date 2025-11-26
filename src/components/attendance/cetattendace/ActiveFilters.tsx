import React from 'react';
import { WorkshopFilterOptions } from './common/FilterComponent';
import Badge from '@/components/ui/badge/Badge';
import { PlusIcon } from '@/icons';

interface WorkshopActiveFiltersProps {
  filters: WorkshopFilterOptions;
  onRemoveFilter: (filterType: string, value?: string) => void;
  onClearAll: () => void;
}

export const WorkshopActiveFilters: React.FC<WorkshopActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
}) => {
  const hasActiveFilters = 
    filters.programTypes.length > 0 ||
    filters.schoolDepts.length > 0 ||
    filters.courseTypes.length > 0 ||
    filters.categories.length > 0 ||
    filters.biaLevels.length > 0 ||
    filters.dateRange.startDate ||
    filters.dateRange.endDate ||
    filters.participantsRange.min !== null ||
    filters.participantsRange.max !== null ||
    filters.traineeHoursRange.min !== null ||
    filters.traineeHoursRange.max !== null ||
    filters.courseHoursRange.min !== null ||
    filters.courseHoursRange.max !== null ||
    filters.cscOnly;

  if (!hasActiveFilters) return null;

  return (
    <div className="px-3 pb-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Active filters:
        </span>
        
        {filters.programTypes.map(type => (
          <Badge
            key={type}
            variant="light"
            color="primary"
            size="sm"
            endIcon={
              <PlusIcon 
                onClick={() => onRemoveFilter('programTypes', type)} 
                aria-label={`Remove ${type} filter`} 
                className="rotate-45 cursor-pointer"
              />
            }
          >
            Program: {type}
          </Badge>
        ))}
        
        {filters.schoolDepts.map(dept => (
          <Badge
            key={dept}
            variant="light"
            color="success"
            size="sm"
            endIcon={
              <PlusIcon 
                onClick={() => onRemoveFilter('schoolDepts', dept)} 
                aria-label={`Remove ${dept} filter`} 
                className="rotate-45 cursor-pointer"
              />
            }
          >
            Dept: {dept}
          </Badge>
        ))}
        
        {filters.courseTypes.map(type => (
          <Badge
            key={type}
            variant="light"
            color="info"
            size="sm"
            endIcon={
              <PlusIcon 
                onClick={() => onRemoveFilter('courseTypes', type)} 
                aria-label={`Remove ${type} filter`} 
                className="rotate-45 cursor-pointer"
              />
            }
          >
            Course: {type}
          </Badge>
        ))}
        
        {filters.categories.map(category => (
          <Badge
            key={category}
            variant="light"
            color="warning"
            size="sm"
            endIcon={
              <PlusIcon 
                onClick={() => onRemoveFilter('categories', category)} 
                aria-label={`Remove ${category} filter`} 
                className="rotate-45 cursor-pointer"
              />
            }
          >
            Category: {category}
          </Badge>
        ))}
        
        {filters.biaLevels.map(level => (
          <Badge
            key={level}
            variant="light"
            color="dark"
            size="sm"
            endIcon={
              <PlusIcon 
                onClick={() => onRemoveFilter('biaLevels', level)} 
                aria-label={`Remove ${level} filter`} 
                className="rotate-45 cursor-pointer"
              />
            }
          >
            BIA: {level}
          </Badge>
        ))}
        
        {filters.cscOnly && (
          <Badge
            variant="light"
            color="primary"
            size="sm"
            endIcon={
              <PlusIcon 
                onClick={() => onRemoveFilter('cscOnly')} 
                aria-label="Remove CSC filter" 
                className="rotate-45 cursor-pointer"
              />
            }
          >
            CSC Only
          </Badge>
        )}
        
        {(filters.dateRange.startDate || filters.dateRange.endDate) && (
          <Badge
            variant="light"
            color="info"
            size="sm"
            endIcon={
              <PlusIcon 
                onClick={() => onRemoveFilter('dateRange')} 
                aria-label="Remove date range filter" 
                className="rotate-45 cursor-pointer"
              />
            }
          >
            Date: {filters.dateRange.startDate || 'Start'} - {filters.dateRange.endDate || 'End'}
          </Badge>
        )}
        
        {(filters.participantsRange.min !== null || filters.participantsRange.max !== null) && (
          <Badge
            variant="light"
            color="success"
            size="sm"
            endIcon={
              <PlusIcon 
                onClick={() => onRemoveFilter('participantsRange')} 
                aria-label="Remove participants range filter" 
                className="rotate-45 cursor-pointer"
              />
            }
          >
            Participants: {filters.participantsRange.min || 0} - {filters.participantsRange.max || '∞'}
          </Badge>
        )}
        
        {(filters.traineeHoursRange.min !== null || filters.traineeHoursRange.max !== null) && (
          <Badge
            variant="light"
            color="warning"
            size="sm"
            endIcon={
              <PlusIcon 
                onClick={() => onRemoveFilter('traineeHoursRange')} 
                aria-label="Remove trainee hours range filter" 
                className="rotate-45 cursor-pointer"
              />
            }
          >
            Trainee Hours: {filters.traineeHoursRange.min || 0} - {filters.traineeHoursRange.max || '∞'}
          </Badge>
        )}
        
        {(filters.courseHoursRange.min !== null || filters.courseHoursRange.max !== null) && (
          <Badge
            variant="light"
            color="dark"
            size="sm"
            endIcon={
              <PlusIcon 
                onClick={() => onRemoveFilter('courseHoursRange')} 
                aria-label="Remove course hours range filter" 
                className="rotate-45 cursor-pointer"
              />
            }
          >
            Course Hours: {filters.courseHoursRange.min || 0} - {filters.courseHoursRange.max || '∞'}
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