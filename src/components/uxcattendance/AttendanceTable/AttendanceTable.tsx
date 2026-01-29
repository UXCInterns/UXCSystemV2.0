"use client";

import React, { useMemo, forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Table } from "@/components/ui/table";
import Pagination from "@/components/common/Pagination";
import { useVisits } from '@/hooks/learningJourney/useVisits';
import { useVisitFilters } from '@/hooks/learningJourney/FilterComponent/useVisitFilters';
import { useVisitTable } from '@/hooks/learningJourney/useVisitTable';
import { VisitTableHeader } from './VisitTableHeader';
import { ActiveFilters } from '../FilterComponent/ActiveFilters';
import { useTableState } from '@/hooks/learningJourney/AttendanceTable/useTableState';
import { useVisitHandlers } from '@/hooks/learningJourney/AttendanceTable/useVisitHandlers';
import { useFilterHandlers } from '@/hooks/learningJourney/AttendanceTable/useFilterHandlers';
import ErrorState from './ErrorState';
import TableStats from './TableStats';
import TableHeaderRow from './TableHeaderRow';
import VisitsTableBody from './VisitsTableBody';
import ModalsContainer from './ModalsContainer';
import VisitMobileCard from './VisitMobileCard';
import type { Visit, FilterOptions } from '@/types/LearningJourneyAttendanceTypes/visit';

export interface UXCAttendanceTableRef {
  getFilteredData: () => Visit[];
  getAllData: () => Visit[];
  getActiveFilters: () => FilterOptions;
  getSearchQuery: () => string;
}

const UXCAttendanceTable = forwardRef<UXCAttendanceTableRef>((props, ref) => {
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

  // Custom hooks for state management
  const {
    expandedVisit,
    isAddVisitOpen,
    editVisit,
    isFilterOpen,
    openViewModal,
    closeViewModal,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openFilterModal,
    closeFilterModal,
  } = useTableState();

  const { visits, isLoading, error, addVisit, updateVisit, deleteVisit } = useVisits();
  
  const {
    activeFilters,
    setActiveFilters,
    applyFilters,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
  } = useVisitFilters(visits);
  
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    sortOptions,
    processTableData,
  } = useVisitTable();

  // Event handlers
  const { handleAddVisit, handleEditVisit, handleDeleteVisit } = useVisitHandlers({
    addVisit,
    updateVisit,
    deleteVisit,
    onAddSuccess: closeAddModal,
    onEditSuccess: closeEditModal,
  });

  const { handleApplyFilters, handleClearFilters, handleRemoveFilter } = useFilterHandlers({
    setActiveFilters,
    clearFilters,
    setCurrentPage,
  });

  // Data processing
  const filteredData = useMemo(() => {
    return applyFilters(visits, activeFilters);
  }, [visits, activeFilters, applyFilters]);

  const { paginatedData, sortedData, totalPages } = useMemo(() => {
    return processTableData(filteredData);
  }, [filteredData, processTableData]);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    getFilteredData: () => sortedData,
    getAllData: () => visits,
    getActiveFilters: () => activeFilters,
    getSearchQuery: () => searchQuery,
  }));

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-auto overflow-x-auto">
        <VisitTableHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onFilterClick={openFilterModal}
          onAddVisitClick={openAddModal}
          isLoading={isLoading}
        />

        {hasActiveFilters && (
          <ActiveFilters
            filters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearFilters}
          />
        )}

        <TableStats
          currentCount={paginatedData.length}
          filteredCount={sortedData.length}
          totalCount={visits.length}
          hasActiveFilters={hasActiveFilters}
        />

        {isMobileView ? (
          // Mobile Card View
          <div className="p-4">
            {paginatedData.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {hasActiveFilters || searchQuery
                  ? "No visits found matching your criteria"
                  : "No visits yet"}
              </div>
            ) : (
              paginatedData.map((visit) => (
                <VisitMobileCard
                  key={visit.id}
                  visit={visit}
                  isLoading={isLoading}
                  onView={openViewModal}
                  onEdit={openEditModal}
                  onDelete={handleDeleteVisit}
                />
              ))
            )}
          </div>
        ) : (
          // Desktop Table View
          <Table className="table-fixed">
            <TableHeaderRow />
            <VisitsTableBody
              visits={paginatedData}
              isLoading={isLoading}
              hasActiveFilters={hasActiveFilters}
              searchQuery={searchQuery}
              onView={openViewModal}
              onEdit={openEditModal}
              onDelete={handleDeleteVisit}
            />
          </Table>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ModalsContainer
        isFilterOpen={isFilterOpen}
        onFilterClose={closeFilterModal}
        currentFilters={activeFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        expandedVisit={expandedVisit}
        onViewClose={closeViewModal}
        isAddVisitOpen={isAddVisitOpen}
        onAddClose={closeAddModal}
        onAddSubmit={handleAddVisit}
        editVisit={editVisit}
        onEditClose={closeEditModal}
        onEditSubmit={handleEditVisit}
      />
    </div>
  );
});

UXCAttendanceTable.displayName = 'UXCAttendanceTable';

export default UXCAttendanceTable;