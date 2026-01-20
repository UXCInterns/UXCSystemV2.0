"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { X } from "lucide-react";
import { WorkshopFilterComponentProps } from "@/types/WorkshopTypes/workshop";
import { useWorkshopFilter } from "@/hooks/workshop/FilterComponent/useWorkshopFilter";
import { FilterHeader } from "./FilterHeader";
import { FilterContent } from "./FilterContent";
import { FilterFooter } from "./FilterFooter";

const WorkshopFilterComponent: React.FC<WorkshopFilterComponentProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
  availableOptions,
  programTypeFilter,
}) => {
  const {
    localFilters,
    searchTerms,
    handleCheckboxChange,
    handleDateRangeChange,
    handleRangeChange,
    handleCSCToggle,
    handleSearchChange,
    clearAllFilters,
    getActiveFilterCount,
  } = useWorkshopFilter(currentFilters, programTypeFilter);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    clearAllFilters();
    onClearFilters();
  };

  const activeFilterCount = getActiveFilterCount();

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
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {programTypeFilter === "pace" ? "PACE " : "Non-PACE "}Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activeFilterCount} active {activeFilterCount === 1 ? 'filter' : 'filters'}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <FilterContent
                programTypeFilter={programTypeFilter}
                localFilters={localFilters}
                searchTerms={searchTerms}
                availableOptions={availableOptions}
                onSearchChange={handleSearchChange}
                onCheckboxChange={handleCheckboxChange}
                onCSCToggle={handleCSCToggle}
                onDateRangeChange={handleDateRangeChange}
                onRangeChange={handleRangeChange}
                isMobile={true}
              />
            </div>

            {/* Mobile Footer Actions */}
            <div>
              <FilterFooter
                activeFilterCount={activeFilterCount}
                onClear={handleClear}
                onCancel={onClose}
                onApply={handleApply}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Modal - Hidden on mobile */}
      <div className="hidden md:block">
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-7xl">
          <FilterHeader
            programTypeFilter={programTypeFilter}
            activeFilterCount={activeFilterCount}
          />

          <FilterContent
            programTypeFilter={programTypeFilter}
            localFilters={localFilters}
            searchTerms={searchTerms}
            availableOptions={availableOptions}
            onSearchChange={handleSearchChange}
            onCheckboxChange={handleCheckboxChange}
            onCSCToggle={handleCSCToggle}
            onDateRangeChange={handleDateRangeChange}
            onRangeChange={handleRangeChange}
            isMobile={false}
          />

          <FilterFooter
            activeFilterCount={activeFilterCount}
            onClear={handleClear}
            onCancel={onClose}
            onApply={handleApply}
          />
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
};

export default WorkshopFilterComponent;