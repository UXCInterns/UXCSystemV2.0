"use client";

import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { WorkshopsTableProps, Workshop } from "@/types/WorkshopTypes/workshop";
import { useWorkshopsTableState } from "@/hooks/workshop/WorkshopsTable/useWorkshopsTableState";
import WorkshopTableHeader from "./WorkshopTableHeader";
import WorkshopTableBody from "./WorkshopTableBody";
import { WorkshopActiveFilters } from "../FilterComponent/ActiveFilters";
import { WorkshopTableStats } from "./WorkshopTableStats";
import { WorkshopsTablePagination } from "./WorkshopsTablePagination";
import WorkshopModals from "./WorkshopModals";
import WorkshopMobileCard from "./WorkshopMobileCard";

export interface WorkshopTableRef {
  getAllData: () => Workshop[];
  getFilteredData: () => Workshop[];
}

const WorkshopsTable = forwardRef<WorkshopTableRef, WorkshopsTableProps>(
  ({ data = [], programTypeFilter = "pace" }, ref) => {
    const [isMobileView, setIsMobileView] = useState(false);

    // Detect mobile view
    useEffect(() => {
      const checkMobileView = () => {
        setIsMobileView(window.innerWidth < 768);
      };
      
      checkMobileView();
      window.addEventListener('resize', checkMobileView);
      
      return () => window.removeEventListener('resize', checkMobileView);
    }, []);

    const tableState = useWorkshopsTableState(data, programTypeFilter);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getAllData: () => tableState.workshops || [],
      getFilteredData: () => tableState.filteredWorkshops || [],
    }));

    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-auto overflow-x-auto">
          {/* Header - Shared by both mobile and desktop */}
          <WorkshopTableHeader
            searchQuery={tableState.searchQuery}
            onSearchChange={tableState.setSearchQuery}
            sortBy={tableState.sortBy}
            onSortChange={tableState.setSortBy}
            activeFilterCount={tableState.activeFilterCount}
            onFilterClick={() => tableState.setIsFilterOpen(true)}
            onAddClick={tableState.openModal}
            isLoading={tableState.isLoading}
          />

          {/* Active Filters - Shared by both views */}
          <WorkshopActiveFilters
            filters={tableState.activeFilters}
            onRemoveFilter={tableState.handleRemoveFilter}
            onClearAll={tableState.handleClearFilters}
          />

          {/* Table Stats - Shared by both views */}
          <WorkshopTableStats
            paginatedCount={tableState.paginatedData.length}
            sortedCount={tableState.sortedData.length}
            filteredByTypeCount={tableState.filteredByTypeData.length}
            programTypeFilter={programTypeFilter}
            searchQuery={tableState.searchQuery}
            hasActiveFilters={tableState.hasActiveFilters}
          />

          {isMobileView ? (
            // Mobile Card View
            <div className="p-4">
              {tableState.paginatedData.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {tableState.searchQuery || tableState.hasActiveFilters
                    ? `No ${programTypeFilter.toUpperCase()} workshops match your search and filter criteria.`
                    : `No ${programTypeFilter.toUpperCase()} workshops found.`}
                </div>
              ) : (
                tableState.paginatedData.map((workshop: Workshop) => (
                  <WorkshopMobileCard
                    key={workshop.id}
                    workshop={workshop}
                    onDetailsClick={tableState.openDetailsModal}
                    onEditClick={tableState.openEditModal}
                    onDeleteClick={tableState.handleDeleteWorkshop}
                  />
                ))
              )}
            </div>
          ) : (
            // Desktop Table View
            <WorkshopTableBody
              data={tableState.paginatedData}
              isLoading={tableState.isLoading}
              programTypeFilter={programTypeFilter}
              searchQuery={tableState.searchQuery}
              hasActiveFilters={tableState.hasActiveFilters}
              onDetailsClick={tableState.openDetailsModal}
              onEditClick={tableState.openEditModal}
              onDeleteClick={tableState.handleDeleteWorkshop}
            />
          )}
        </div>

        <WorkshopsTablePagination
          currentPage={tableState.currentPage}
          totalPages={tableState.totalPages}
          onPageChange={tableState.setCurrentPage}
        />

        <WorkshopModals
          isFilterOpen={tableState.isFilterOpen}
          onFilterClose={() => tableState.setIsFilterOpen(false)}
          onApplyFilters={tableState.handleApplyFilters}
          onClearFilters={tableState.handleClearFilters}
          currentFilters={tableState.activeFilters}
          availableOptions={tableState.availableFilterOptions}
          programTypeFilter={programTypeFilter}
          
          isNewOpen={tableState.isOpen}
          onNewClose={tableState.closeModal}
          onCreateWorkshop={tableState.handleCreateWorkshop}
          
          isEditOpen={tableState.isEditOpen}
          onEditClose={tableState.closeEditModal}
          onUpdateWorkshop={tableState.handleUpdateWorkshop}
          selectedWorkshopForEdit={tableState.selectedWorkshopForEdit}
          
          isDetailsOpen={tableState.isDetailsOpen}
          onDetailsClose={tableState.closeDetailsModal}
          selectedWorkshop={tableState.selectedWorkshop}
        />
      </div>
    );
  }
);

WorkshopsTable.displayName = 'WorkshopsTable';

export default WorkshopsTable;