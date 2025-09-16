// components/WorkshopModals.tsx
import React from 'react';
import WorkshopFilterComponent, { WorkshopFilterOptions } from "../common/FilterComponent";
import NewWorkshopForm from "../common/NewVisitForm";
import EditWorkshopForm from "../common/EditVisitForm";
import WorkshopDetailsModal from "../common/ViewDetails";
import { Workshop } from '@/types/workshop';

interface WorkshopModalsProps {
  // Filter modal props
  isFilterOpen: boolean;
  onFilterClose: () => void;
  onApplyFilters: (filters: WorkshopFilterOptions) => void;
  onClearFilters: () => void;
  currentFilters: WorkshopFilterOptions;
  availableOptions: any;
  programTypeFilter: "pace" | "non_pace";
  
  // New workshop modal props
  isNewOpen: boolean;
  onNewClose: () => void;
  onCreateWorkshop: (data: any) => Promise<{ success: boolean; error?: string }>;
  
  // Edit workshop modal props
  isEditOpen: boolean;
  onEditClose: () => void;
  onUpdateWorkshop: (data: any) => Promise<{ success: boolean; error?: string }>;
  selectedWorkshopForEdit: Workshop | null;
  
  // Details modal props
  isDetailsOpen: boolean;
  onDetailsClose: () => void;
  selectedWorkshop: Workshop | null;
}

const WorkshopModals: React.FC<WorkshopModalsProps> = ({
  isFilterOpen,
  onFilterClose,
  onApplyFilters,
  onClearFilters,
  currentFilters,
  availableOptions,
  programTypeFilter,
  isNewOpen,
  onNewClose,
  onCreateWorkshop,
  isEditOpen,
  onEditClose,
  onUpdateWorkshop,
  selectedWorkshopForEdit,
  isDetailsOpen,
  onDetailsClose,
  selectedWorkshop
}) => {
  const handleCreateWorkshop = async (workshopData: any) => {
    const result = await onCreateWorkshop(workshopData);
    if (result.success) {
      onNewClose();
    } else {
      alert('Failed to create workshop: ' + result.error);
    }
  };

  const handleUpdateWorkshop = async (workshopData: any) => {
    const result = await onUpdateWorkshop(workshopData);
    if (result.success) {
      onEditClose();
    } else {
      alert('Failed to update workshop: ' + result.error);
    }
  };

  return (
    <>
      {/* Filter Modal */}
      <WorkshopFilterComponent
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        currentFilters={currentFilters}
        availableOptions={availableOptions}
        programTypeFilter={programTypeFilter} 
      />

      {/* New Workshop Form Modal */}
      <NewWorkshopForm
        isOpen={isNewOpen}
        onClose={onNewClose}
        onSubmit={handleCreateWorkshop}
      />

      {/* Edit Workshop Form Modal */}
      <EditWorkshopForm
        isOpen={isEditOpen}
        onClose={onEditClose}
        onSubmit={handleUpdateWorkshop}
        workshop={selectedWorkshopForEdit}
      />

      {/* Workshop Details Modal */}
      <WorkshopDetailsModal
        workshop={selectedWorkshop}
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
      />
    </>
  );
};

export default WorkshopModals;