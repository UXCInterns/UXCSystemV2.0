"use client";

import React, { useState } from "react";
import { Download, Calendar, Filter, X } from "lucide-react";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filters: ExportFilters) => void;
  allData: Visit[];
}

export interface ExportFilters {
  years?: string[];
  months?: string[];
  dateFrom?: string;
  dateTo?: string;
  conversionStatus?: string[];
  sessionType?: string[];
  sector?: string[];
  industry?: string[];
  companySize?: string[];
  consultancy?: boolean | null;
  training?: boolean | null;
  pace?: boolean | null;
  informal?: boolean | null;
}

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export default function ExportModal({ isOpen, onClose, onExport, allData }: ExportModalProps) {
  const [filters, setFilters] = useState<ExportFilters>({
    years: [],
    months: [],
    conversionStatus: [],
    sessionType: [],
    sector: [],
    industry: [],
    companySize: [],
  });

  // Get unique years from data
  const availableYears = Array.from(
    new Set(allData.map(v => new Date(v.date_of_visit).getFullYear()))
  ).sort((a, b) => b - a);

  // Get unique values for filters
  const uniqueStatuses = Array.from(new Set(allData.map(v => v.conversion_status).filter(Boolean)));
  const uniqueSessionTypes = Array.from(new Set(allData.map(v => v.session_type).filter(Boolean)));
  const uniqueSectors = Array.from(new Set(allData.map(v => v.sector).filter(Boolean)));
  const uniqueIndustries = Array.from(new Set(allData.map(v => v.industry).filter(Boolean)));
  const uniqueSizes = Array.from(new Set(allData.map(v => v.size).filter(Boolean)));

  const handleYearToggle = (year: number) => {
    const yearStr = year.toString();
    setFilters(prev => ({
      ...prev,
      years: prev.years?.includes(yearStr)
        ? prev.years.filter(y => y !== yearStr)
        : [...(prev.years || []), yearStr],
    }));
  };

  const handleMonthToggle = (month: string) => {
    setFilters(prev => ({
      ...prev,
      months: prev.months?.includes(month)
        ? prev.months.filter(m => m !== month)
        : [...(prev.months || []), month],
    }));
  };

  const handleMultiSelectToggle = (field: keyof ExportFilters, value: string) => {
    setFilters(prev => {
      const currentArray = prev[field] as string[] || [];
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter(v => v !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleReset = () => {
    setFilters({
      years: [],
      months: [],
      conversionStatus: [],
      sessionType: [],
      sector: [],
      industry: [],
      companySize: [],
    });
  };

  const handleExport = () => {
    onExport(filters);
    onClose();
  };

  const getFilteredCount = () => {
    let filtered = [...allData];

    if (filters.years && filters.years.length > 0) {
      filtered = filtered.filter(v => 
        filters.years!.includes(new Date(v.date_of_visit).getFullYear().toString())
      );
    }

    if (filters.months && filters.months.length > 0) {
      filtered = filtered.filter(v => {
        const month = (new Date(v.date_of_visit).getMonth() + 1).toString().padStart(2, '0');
        return filters.months!.includes(month);
      });
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(v => new Date(v.date_of_visit) >= new Date(filters.dateFrom!));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(v => new Date(v.date_of_visit) <= new Date(filters.dateTo!));
    }

    if (filters.conversionStatus && filters.conversionStatus.length > 0) {
      filtered = filtered.filter(v => filters.conversionStatus!.includes(v.conversion_status));
    }

    if (filters.sessionType && filters.sessionType.length > 0) {
      filtered = filtered.filter(v => filters.sessionType!.includes(v.session_type));
    }

    if (filters.sector && filters.sector.length > 0) {
      filtered = filtered.filter(v => filters.sector!.includes(v.sector));
    }

    if (filters.industry && filters.industry.length > 0) {
      filtered = filtered.filter(v => filters.industry!.includes(v.industry));
    }

    if (filters.companySize && filters.companySize.length > 0) {
      filtered = filtered.filter(v => filters.companySize!.includes(v.size));
    }

    if (filters.consultancy !== null && filters.consultancy !== undefined) {
      filtered = filtered.filter(v => v.consultancy === filters.consultancy);
    }

    if (filters.training !== null && filters.training !== undefined) {
      filtered = filtered.filter(v => v.training === filters.training);
    }

    if (filters.pace !== null && filters.pace !== undefined) {
      filtered = filtered.filter(v => v.pace === filters.pace);
    }

    if (filters.informal !== null && filters.informal !== undefined) {
      filtered = filtered.filter(v => v.informal === filters.informal);
    }

    return filtered.length;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Full-Screen Modal */}
      <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="absolute inset-0 flex items-end">
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl max-h-[90vh] flex flex-col animate-slideUp shadow-2xl">
            {/* Mobile Header */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-white/[0.05] bg-white dark:bg-gray-900 rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Export to Excel
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleReset}
                >
                  Reset Filters
                </Button>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {/* Date Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </h4>
                  
                  {/* Year Selection */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Select Years
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableYears.map(year => (
                        <button
                          key={year}
                          onClick={() => handleYearToggle(year)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filters.years?.includes(year.toString())
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                    {filters.years && filters.years.length > 0 && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Selected: {filters.years.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Month Selection */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Select Months
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {MONTHS.map(month => (
                        <button
                          key={month.value}
                          onClick={() => handleMonthToggle(month.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filters.months?.includes(month.value)
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {month.label.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateFrom || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value || undefined }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateTo || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value || undefined }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Additional Filters
                  </h4>

                  {/* Conversion Status */}
                  {uniqueStatuses.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Conversion Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueStatuses.map(status => (
                          <button
                            key={status}
                            onClick={() => handleMultiSelectToggle('conversionStatus', status)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.conversionStatus?.includes(status)
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Session Type */}
                  {uniqueSessionTypes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Session Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSessionTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => handleMultiSelectToggle('sessionType', type)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.sessionType?.includes(type)
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sector */}
                  {uniqueSectors.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Sector
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSectors.map(sector => (
                          <button
                            key={sector}
                            onClick={() => handleMultiSelectToggle('sector', sector)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.sector?.includes(sector)
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {sector}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Company Size */}
                  {uniqueSizes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Company Size
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => handleMultiSelectToggle('companySize', size)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.companySize?.includes(size)
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Types */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Service Types
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <Checkbox
                        label="Consultancy Only"
                        checked={filters.consultancy === true}
                        onChange={(checked) => setFilters(prev => ({ 
                          ...prev, 
                          consultancy: checked ? true : null 
                        }))}
                      />
                      <Checkbox
                        label="Training Only"
                        checked={filters.training === true}
                        onChange={(checked) => setFilters(prev => ({ 
                          ...prev, 
                          training: checked ? true : null 
                        }))}
                      />
                      <Checkbox
                        label="PACE Only"
                        checked={filters.pace === true}
                        onChange={(checked) => setFilters(prev => ({ 
                          ...prev, 
                          pace: checked ? true : null 
                        }))}
                      />
                      <Checkbox
                        label="Informal Only"
                        checked={filters.informal === true}
                        onChange={(checked) => setFilters(prev => ({ 
                          ...prev, 
                          informal: checked ? true : null 
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-4 py-4 border-t border-gray-200 dark:border-white/[0.05]">
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
                <span className="font-medium">{getFilteredCount()}</span> of {allData.length} visits will be exported
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={onClose}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleExport}
                  startIcon={<Download className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Export Excel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Modal - Hidden on mobile */}
      <div className="hidden md:block">
        <Modal 
          isOpen={isOpen} 
          onClose={onClose}
          showCloseButton={false}
          className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                {/* Left: icon + title */}
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Export to Excel
                  </h3>
                </div>

                {/* Right: reset button */}
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleReset}
                >
                  Reset Filters
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="space-y-6">
                {/* Date Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </h4>
                  
                  {/* Year Selection - Multi-select Buttons */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Select Years
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableYears.map(year => (
                        <button
                          key={year}
                          onClick={() => handleYearToggle(year)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filters.years?.includes(year.toString())
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                    {filters.years && filters.years.length > 0 && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Selected: {filters.years.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Month Selection */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Select Months
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {MONTHS.map(month => (
                        <button
                          key={month.value}
                          onClick={() => handleMonthToggle(month.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            filters.months?.includes(month.value)
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {month.label.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        From Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateFrom || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value || undefined }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        To Date
                      </label>
                      <input
                        type="date"
                        value={filters.dateTo || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value || undefined }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Filters */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Additional Filters
                  </h4>

                  {/* Conversion Status */}
                  {uniqueStatuses.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Conversion Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueStatuses.map(status => (
                          <button
                            key={status}
                            onClick={() => handleMultiSelectToggle('conversionStatus', status)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.conversionStatus?.includes(status)
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Session Type */}
                  {uniqueSessionTypes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Session Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSessionTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => handleMultiSelectToggle('sessionType', type)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.sessionType?.includes(type)
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sector */}
                  {uniqueSectors.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Sector
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSectors.map(sector => (
                          <button
                            key={sector}
                            onClick={() => handleMultiSelectToggle('sector', sector)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.sector?.includes(sector)
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {sector}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Company Size */}
                  {uniqueSizes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Company Size
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map(size => (
                          <button
                            key={size}
                            onClick={() => handleMultiSelectToggle('companySize', size)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.companySize?.includes(size)
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Service Types */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Service Types
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <Checkbox
                        label="Consultancy Only"
                        checked={filters.consultancy === true}
                        onChange={(checked) => setFilters(prev => ({ 
                          ...prev, 
                          consultancy: checked ? true : null 
                        }))}
                      />
                      <Checkbox
                        label="Training Only"
                        checked={filters.training === true}
                        onChange={(checked) => setFilters(prev => ({ 
                          ...prev, 
                          training: checked ? true : null 
                        }))}
                      />
                      <Checkbox
                        label="PACE Only"
                        checked={filters.pace === true}
                        onChange={(checked) => setFilters(prev => ({ 
                          ...prev, 
                          pace: checked ? true : null 
                        }))}
                      />
                      <Checkbox
                        label="Informal Only"
                        checked={filters.informal === true}
                        onChange={(checked) => setFilters(prev => ({ 
                          ...prev, 
                          informal: checked ? true : null 
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{getFilteredCount()}</span> of {allData.length} visits will be exported
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleExport}
                  startIcon={<Download className="w-4 h-4" />}
                >
                  Export Excel
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}