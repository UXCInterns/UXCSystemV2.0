"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { FilterComponentProps } from "@/types/LearningJourneyAttendanceTypes/visit";
import FilterHeader from "./FilterHeader";
import FilterFooter from "./FilterFooter";
import FilterGrid from "./FilterGrid";
import { useFilterState } from "@/hooks/learningJourney/FilterComponent/useFilterState";
import {  SECTORS, SESSION_TYPES, ORGANIZATION_SIZES, INDUSTRIES } from "@/hooks/learningJourney/useOrganistationCat";

const FilterComponent: React.FC<FilterComponentProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
}) => {
  const {
    localFilters,
    searchTerms,
    handleCheckboxChange,
    handleDateRangeChange,
    handleAttendedRangeChange,
    handleSearchChange,
    resetFilters,
    getActiveFilterCount
  } = useFilterState(currentFilters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    resetFilters();
    onClearFilters();
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl">
      <FilterHeader activeFilterCount={activeFilterCount} />

      <FilterGrid
        filters={localFilters}
        searchTerms={searchTerms}
        sectors={SECTORS}
        industries={INDUSTRIES}
        organizationSizes={ORGANIZATION_SIZES}
        sessionTypes={SESSION_TYPES}
        onCheckboxChange={handleCheckboxChange}
        onSearchChange={handleSearchChange}
        onDateChange={handleDateRangeChange}
        onAttendanceChange={handleAttendedRangeChange}
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

export default FilterComponent;