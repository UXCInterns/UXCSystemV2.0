import React from 'react';
import FilterComponent from "../FilterComponent/FilterComponent";
import VisitDetailsModal from "../ViewDetailsModal/ViewDetailsModal";
import NewVisitForm from "../NewVisitModal/NewVisitModal";
import EditVisitForm from "../EditVisitModal/EditVisitModal";
import { Visit, FilterState, VisitFormData } from '@/types/LearningJourneyAttendanceTypes/visit';

interface ModalsContainerProps {
  // Filter Modal
  isFilterOpen: boolean;
  onFilterClose: () => void;
  currentFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onClearFilters: () => void;
  
  // View Modal
  expandedVisit: Visit | null;
  onViewClose: () => void;
  
  // Add Modal
  isAddVisitOpen: boolean;
  onAddClose: () => void;
  onAddSubmit: (visitData: Partial<VisitFormData>) => void; // ✅ Changed to Partial
  
  // Edit Modal
  editVisit: Visit | null;
  onEditClose: () => void;
  onEditSubmit: (visitData: Partial<Visit>) => void; // ✅ This should also be Partial<Visit> to match EditVisitFormProps
}

const ModalsContainer: React.FC<ModalsContainerProps> = ({
  isFilterOpen,
  onFilterClose,
  currentFilters,
  onApplyFilters,
  onClearFilters,
  expandedVisit,
  onViewClose,
  isAddVisitOpen,
  onAddClose,
  onAddSubmit,
  editVisit,
  onEditClose,
  onEditSubmit,
}) => {
  return (
    <>
      <FilterComponent
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        currentFilters={currentFilters}
      />

      <VisitDetailsModal
        visit={expandedVisit}
        isOpen={!!expandedVisit}
        onClose={onViewClose}
      />

      <NewVisitForm
        isOpen={isAddVisitOpen}
        onClose={onAddClose}
        onSubmit={onAddSubmit}
      />

      <EditVisitForm
        isOpen={!!editVisit}
        onClose={onEditClose}
        onSubmit={onEditSubmit}
        visit={editVisit}
      />
    </>
  );
};

export default ModalsContainer;