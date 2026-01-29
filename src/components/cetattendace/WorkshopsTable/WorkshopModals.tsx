// components/WorkshopModals.tsx
import React from 'react';
import WorkshopFilterComponent from "../FilterComponent/FilterComponent";
import NewWorkshopForm from "../NewVisitModal/NewVisitModal";
import EditWorkshopForm from "../EditVisitModal/EditVisitModal";
import WorkshopDetailsModal from "../ViewDetailsModal/ViewDetailsModal";
import { WorkshopModalsProps, NewWorkshopFormData, Workshop } from '@/types/WorkshopTypes/workshop';

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
  const handleCreateWorkshop = async (workshopData: NewWorkshopFormData) => {
    const result = await onCreateWorkshop(workshopData);
    if (result.success) {
      onNewClose();
    } else {
      alert('Failed to create workshop: ' + result.error);
    }
  };

  const handleUpdateWorkshop = async (workshopData: Partial<Workshop>) => {
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