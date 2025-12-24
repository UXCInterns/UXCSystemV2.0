"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { WorkshopFilterComponentProps } from "@/types/workshop";
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

  return (
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
      />

      <FilterFooter
        activeFilterCount={activeFilterCount}
        onClear={handleClear}
        onCancel={onClose}
        onApply={handleApply}
      />
    </Modal>
  );
};

export default WorkshopFilterComponent;