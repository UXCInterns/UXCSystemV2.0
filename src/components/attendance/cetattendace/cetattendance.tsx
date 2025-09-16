"use client";

import React, { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { useWorkshopFilters } from "@/hooks/workshop/useWorkshopFilters";
import { WorkshopsTableProps } from "@/types/workshop";
import { useWorkshopData } from "@/hooks/workshop/useWorkshopData";
import { useWorkshopModals } from "@/hooks/workshop/useWorkshopModals";
import { useWorkshopPagination } from "@/hooks/workshop/useWorkshopPagination";
import WorkshopTableHeader from "./common/WorkshopTableHeader";
import WorkshopTableBody from "./common/WorkshopTableBody";
import WorkshopModals from "./common/WorkshopModals";
import { WorkshopActiveFilters } from "./common/ActiveFilters";
import Pagination from "@/components/common/Pagination";
import { ITEMS_PER_PAGE } from "@/constants/workshopConstants";
import { WorkshopFilterOptions } from "./common/FilterComponent";

const WorkshopsTable: React.FC<WorkshopsTableProps> = ({ 
  data = [], 
  programTypeFilter = "pace" 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Custom hooks for data management
  const {
    tableData,
    isLoading,
    fetchWorkshops,
    handleCreateWorkshop,
    handleUpdateWorkshop,
    handleDeleteWorkshop
  } = useWorkshopData(data);

  // Filter management
  const {
    activeFilters,
    setActiveFilters,
    availableFilterOptions,
    applyFilters,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
    removeFilter,
  } = useWorkshopFilters(tableData);

  // Modal management
  const {
    isFilterOpen,
    setIsFilterOpen,
    selectedWorkshop,
    selectedWorkshopForEdit,
    isDetailsOpen,
    isEditOpen,
    openDetailsModal,
    closeDetailsModal,
    openEditModal,
    closeEditModal,
  } = useWorkshopModals();

  const { isOpen, openModal, closeModal } = useModal();

  // Data processing and pagination logic
  const {
    paginatedData,
    sortedData,
    totalPages,
    filteredByTypeData
  } = useWorkshopPagination(
    tableData,
    searchQuery,
    sortBy,
    currentPage,
    programTypeFilter,
    activeFilters,
    ITEMS_PER_PAGE,
    applyFilters
  );

  // Clear irrelevant filters when programTypeFilter changes
  useEffect(() => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (programTypeFilter === "pace") {
        newFilters.cscOnly = false;
      } else if (programTypeFilter === "non_pace") {
        newFilters.categories = [];
      }
      
      return newFilters;
    });
    setCurrentPage(1);
  }, [programTypeFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, programTypeFilter, activeFilters]);

  const handleApplyFilters = (filters: WorkshopFilterOptions) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  const handleRemoveFilter = (filterType: string, value?: string) => {
    removeFilter(filterType, value);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-auto overflow-x-auto">
        <WorkshopTableHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          activeFilterCount={activeFilterCount}
          onFilterClick={() => setIsFilterOpen(true)}
          onAddClick={openModal}
          isLoading={isLoading}
        />

        <WorkshopActiveFilters
          filters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearFilters}
        />

        <div className="px-3 pb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {paginatedData.length} of {sortedData.length} {programTypeFilter.toUpperCase()} workshops
            {(searchQuery || hasActiveFilters) && ` (filtered from ${filteredByTypeData.length} total ${programTypeFilter.toUpperCase()})`}
          </span>
        </div>
        
        <WorkshopTableBody
          data={paginatedData}
          isLoading={isLoading}
          programTypeFilter={programTypeFilter}
          searchQuery={searchQuery}
          hasActiveFilters={hasActiveFilters}
          onDetailsClick={openDetailsModal}
          onEditClick={openEditModal}
          onDeleteClick={handleDeleteWorkshop}
        />
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <WorkshopModals
        // Filter modal props
        isFilterOpen={isFilterOpen}
        onFilterClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        currentFilters={activeFilters}
        availableOptions={availableFilterOptions}
        programTypeFilter={programTypeFilter}
        
        // New workshop modal props
        isNewOpen={isOpen}
        onNewClose={closeModal}
        onCreateWorkshop={handleCreateWorkshop}
        
        // Edit workshop modal props
        isEditOpen={isEditOpen}
        onEditClose={closeEditModal}
        onUpdateWorkshop={handleUpdateWorkshop}
        selectedWorkshopForEdit={selectedWorkshopForEdit}
        
        // Details modal props
        isDetailsOpen={isDetailsOpen}
        onDetailsClose={closeDetailsModal}
        selectedWorkshop={selectedWorkshop}
      />
    </div>
  );
};

export default WorkshopsTable;