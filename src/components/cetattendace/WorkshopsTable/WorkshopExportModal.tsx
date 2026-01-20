"use client";

import React, { useState } from "react";
import { Download, Calendar, Filter, X } from "lucide-react";
import { Workshop } from "@/types/WorkshopTypes/workshop";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filters: ExportFilters) => void;
  allData: Workshop[];
}

export interface ExportFilters {
  years?: string[];
  months?: string[];
  dateFrom?: string;
  dateTo?: string;
  programType?: string[];
  courseType?: string[];
  category?: string[];
  biaLevel?: string[];
  csc?: boolean | null;
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

export default function WorkshopExportModal({ isOpen, onClose, onExport, allData }: ExportModalProps) {
  const [filters, setFilters] = useState<ExportFilters>({
    years: [],
    months: [],
    programType: [],
    courseType: [],
    category: [],
    biaLevel: [],
  });

  // Get unique years from data
  const availableYears = Array.from(
    new Set(allData.map(w => new Date(w.program_start_date).getFullYear()))
  ).sort((a, b) => b - a);

  // Get unique values for filters
  const uniqueProgramTypes = Array.from(
    new Set(allData.map(w => w.program_type).filter((type): type is string => Boolean(type)))
  );
  
  const uniqueCourseTypes = Array.from(
    new Set(allData.map(w => w.course_type).filter((type): type is string => Boolean(type)))
  );
  
  const uniqueCategories = Array.from(
    new Set(allData.map(w => w.category).filter((category): category is string => Boolean(category)))
  );
  
  const uniqueBiaLevels = Array.from(
    new Set(allData.map(w => w.bia_level).filter((level): level is string => Boolean(level)))
  );

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
      const currentArray = (prev[field] as string[] | undefined) || [];
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
      programType: [],
      courseType: [],
      category: [],
      biaLevel: [],
    });
  };

  const handleExport = () => {
    onExport(filters);
    onClose();
  };

  const getFilteredCount = () => {
    let filtered = [...allData];

    if (filters.years && filters.years.length > 0) {
      filtered = filtered.filter(w => 
        filters.years!.includes(new Date(w.program_start_date).getFullYear().toString())
      );
    }

    if (filters.months && filters.months.length > 0) {
      filtered = filtered.filter(w => {
        const month = (new Date(w.program_start_date).getMonth() + 1).toString().padStart(2, '0');
        return filters.months!.includes(month);
      });
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(w => new Date(w.program_start_date) >= new Date(filters.dateFrom!));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(w => new Date(w.program_end_date) <= new Date(filters.dateTo!));
    }

    if (filters.programType && filters.programType.length > 0) {
      filtered = filtered.filter(w => filters.programType!.includes(w.program_type));
    }

    if (filters.courseType && filters.courseType.length > 0) {
      filtered = filtered.filter(w => w.course_type && filters.courseType!.includes(w.course_type));
    }

    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(w => w.category && filters.category!.includes(w.category));
    }

    if (filters.biaLevel && filters.biaLevel.length > 0) {
      filtered = filtered.filter(w => w.bia_level && filters.biaLevel!.includes(w.bia_level));
    }

    if (filters.csc === true) {
      filtered = filtered.filter(w => w.csc === true);
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
                    Export Workshops
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

                  {/* Program Type */}
                  {uniqueProgramTypes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Program Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueProgramTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => handleMultiSelectToggle('programType', type)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.programType?.includes(type)
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

                  {/* Course Type */}
                  {uniqueCourseTypes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Course Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueCourseTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => handleMultiSelectToggle('courseType', type)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.courseType?.includes(type)
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  {uniqueCategories.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueCategories.map(category => (
                          <button
                            key={category}
                            onClick={() => handleMultiSelectToggle('category', category)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.category?.includes(category)
                                ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BIA Level */}
                  {uniqueBiaLevels.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        BIA Level
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueBiaLevels.map(level => (
                          <button
                            key={level}
                            onClick={() => handleMultiSelectToggle('biaLevel', level)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.biaLevel?.includes(level)
                                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CSC Filter */}
                  <div className="mb-4">
                    <Checkbox
                      label="CSC Workshops Only"
                      checked={filters.csc === true}
                      onChange={(checked) => setFilters(prev => ({ 
                        ...prev, 
                        csc: checked ? true : null 
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 px-4 py-4 border-t border-gray-200 dark:border-white/[0.05]">
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
                <span className="font-medium">{getFilteredCount()}</span> of {allData.length} workshops will be exported
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
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Export Workshops to Excel
                </h3>
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

                  {/* Program Type */}
                  {uniqueProgramTypes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Program Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueProgramTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => handleMultiSelectToggle('programType', type)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.programType?.includes(type)
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

                  {/* Course Type */}
                  {uniqueCourseTypes.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Course Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueCourseTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => handleMultiSelectToggle('courseType', type)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.courseType?.includes(type)
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category */}
                  {uniqueCategories.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueCategories.map(category => (
                          <button
                            key={category}
                            onClick={() => handleMultiSelectToggle('category', category)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.category?.includes(category)
                                ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BIA Level */}
                  {uniqueBiaLevels.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        BIA Level
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {uniqueBiaLevels.map(level => (
                          <button
                            key={level}
                            onClick={() => handleMultiSelectToggle('biaLevel', level)}
                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              filters.biaLevel?.includes(level)
                                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CSC Filter */}
                  <div className="mb-4">
                    <Checkbox
                      label="CSC Workshops Only"
                      checked={filters.csc === true}
                      onChange={(checked) => setFilters(prev => ({ 
                        ...prev, 
                        csc: checked ? true : null 
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{getFilteredCount()}</span> of {allData.length} workshops will be exported
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleReset}
                >
                  Reset Filters
                </Button>
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