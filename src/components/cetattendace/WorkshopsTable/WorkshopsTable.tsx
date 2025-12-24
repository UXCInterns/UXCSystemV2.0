"use client";

import React from "react";
import { WorkshopsTableProps } from "@/types/workshop";
import { useWorkshopsTableState } from "@/hooks/workshop/WorkshopsTable/useWorkshopsTableState";
import { WorkshopsTableContent } from "./WorkshopsTableContent";
import { WorkshopsTablePagination } from "./WorkshopsTablePagination";
import WorkshopModals from "./WorkshopModals";

const WorkshopsTable: React.FC<WorkshopsTableProps> = ({ 
  data = [], 
  programTypeFilter = "pace" 
}) => {
  const tableState = useWorkshopsTableState(data, programTypeFilter);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-auto overflow-x-auto">
        <WorkshopsTableContent 
          tableState={tableState}
          programTypeFilter={programTypeFilter}
        />
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
};

export default WorkshopsTable;