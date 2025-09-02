"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import { Modal } from "@/components/ui/modal/index";
import { SECTORS, SESSION_TYPES, ORGANIZATION_SIZES, INDUSTRIES } from "@/hooks/useOrganistationCat";

export interface FilterOptions {
  sessionTypes: string[];
  sectors: string[];
  industries: string[];
  companySizes: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  attendedRange: {
    min: number | null;
    max: number | null;
  };
}

export interface FilterComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  currentFilters: FilterOptions;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(currentFilters);
  const [searchTerms, setSearchTerms] = useState({
    sessionTypes: '',
    sectors: '',
    industries: '',
    companySizes: ''
  });

  // Update local filters when current filters change
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

  const filterOptions = (options: string[], searchTerm: string) => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
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
    onClearFilters();
  };

  const getActiveFilterCount = () => {
    const count = 
      localFilters.sessionTypes.length +
      localFilters.sectors.length +
      localFilters.industries.length +
      localFilters.companySizes.length +
      (localFilters.dateRange.startDate ? 1 : 0) +
      (localFilters.dateRange.endDate ? 1 : 0) +
      (localFilters.attendedRange.min !== null ? 1 : 0) +
      (localFilters.attendedRange.max !== null ? 1 : 0);
    return count;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Filter Visits
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
            
            {/* Sector Filter */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Sector
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Organization sector type
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <Input
                  type="text"
                  placeholder="Search sectors..."
                  value={searchTerms.sectors}
                  onChange={(e) => handleSearchChange('sectors', e.target.value)}
                  className="mb-3"
                />
                <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                  {filterOptions(SECTORS, searchTerms.sectors).map(sector => (
                    <Checkbox
                      key={sector}
                      label={sector}
                      checked={localFilters.sectors.includes(sector)}
                      onChange={(checked) => handleCheckboxChange('sectors', sector, checked)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Industry Filter */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Industry
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Specific industry classification
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <Input
                  type="text"
                  placeholder="Search industries..."
                  value={searchTerms.industries}
                  onChange={(e) => handleSearchChange('industries', e.target.value)}
                  className="mb-3"
                />
                <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                  {filterOptions(INDUSTRIES, searchTerms.industries).map(industry => (
                    <Checkbox
                      key={industry}
                      label={industry}
                      checked={localFilters.industries.includes(industry)}
                      onChange={(checked) => handleCheckboxChange('industries', industry, checked)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Company Size Filter */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Organization Size
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Company size classification
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <Input
                  type="text"
                  placeholder="Search sizes..."
                  value={searchTerms.companySizes}
                  onChange={(e) => handleSearchChange('companySizes', e.target.value)}
                  className="mb-3"
                />
                <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                  {filterOptions(ORGANIZATION_SIZES, searchTerms.companySizes).map(size => (
                    <Checkbox
                      key={size}
                      label={size}
                      checked={localFilters.companySizes.includes(size)}
                      onChange={(checked) => handleCheckboxChange('companySizes', size, checked)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Visit Date Range
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Filter by visit dates
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                <div>
                  <Label htmlFor="start-date" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={localFilters.dateRange.startDate}
                    onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={localFilters.dateRange.endDate}
                    onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Attended Range Filter */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Attendance Range
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Filter by number of attendees
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
                <div>
                  <Label htmlFor="min-attended" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Attendees
                  </Label>
                  <Input
                    id="min-attended"
                    type="number"
                    min="0"
                    value={localFilters.attendedRange.min || ''}
                    onChange={(e) => handleAttendedRangeChange('min', e.target.value)}
                    placeholder="Min attendees"
                  />
                </div>
                <div>
                  <Label htmlFor="max-attended" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Attendees
                  </Label>
                  <Input
                    id="max-attended"
                    type="number"
                    min="0"
                    value={localFilters.attendedRange.max || ''}
                    onChange={(e) => handleAttendedRangeChange('max', e.target.value)}
                    placeholder="Max attendees"
                  />
                </div>
              </div>
            </div>

            {/* Session Type Filter */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">
                  Session Type
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Filter by session time
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                  {SESSION_TYPES.map(type => (
                    <Checkbox
                      key={type}
                      label={type}
                      checked={localFilters.sessionTypes.includes(type)}
                      onChange={(checked) => handleCheckboxChange('sessionTypes', type, checked)}
                    />
                  ))}
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

export default FilterComponent;