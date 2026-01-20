import React from "react";
import WorkshopTableHeader from "./WorkshopTableHeader";
import WorkshopTableBody from "./WorkshopTableBody";
import { WorkshopActiveFilters } from "../FilterComponent/ActiveFilters";
import { WorkshopTableStats } from "./WorkshopTableStats";
import { WorkshopsTableContentProps } from "@/types/WorkshopTypes/workshop";

export const WorkshopsTableContent: React.FC<WorkshopsTableContentProps> = ({ 
  tableState, 
  programTypeFilter 
}) => {
  return (
    <>
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

      <WorkshopActiveFilters
        filters={tableState.activeFilters}
        onRemoveFilter={tableState.handleRemoveFilter}
        onClearAll={tableState.handleClearFilters}
      />

      <WorkshopTableStats
        paginatedCount={tableState.paginatedData.length}
        sortedCount={tableState.sortedData.length}
        filteredByTypeCount={tableState.filteredByTypeData.length}
        programTypeFilter={programTypeFilter}
        searchQuery={tableState.searchQuery}
        hasActiveFilters={tableState.hasActiveFilters}
      />
      
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
    </>
  );
};