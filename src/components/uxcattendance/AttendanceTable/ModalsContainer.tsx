import React from 'react';
import FilterComponent from "../FilterComponent/FilterComponent";
import VisitDetailsModal from "../ViewDetailsModal/ViewDetailsModal";
import NewVisitForm from "../NewVisitModal/NewVisitModal";
import EditVisitForm from "../EditVisitModal/EditVisitModal";
import { Visit } from '@/types/LearningJourneyAttendanceTypes/visit';
import { FilterState } from '@/types/LearningJourneyAttendanceTypes/visit';

interface ModalsContainerProps {
  // Filter Modal
  isFilterOpen: boolean;
  onFilterClose: () => void;
  currentFilters: FilterState;
  onApplyFilters: (filters: any) => void;
  onClearFilters: () => void;
  
  // View Modal
  expandedVisit: Visit | null;
  onViewClose: () => void;
  
  // Add Modal
  isAddVisitOpen: boolean;
  onAddClose: () => void;
  onAddSubmit: (visitData: any) => void;
  
  // Edit Modal
  editVisit: Visit | null;
  onEditClose: () => void;
  onEditSubmit: (visitData: any) => void;
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