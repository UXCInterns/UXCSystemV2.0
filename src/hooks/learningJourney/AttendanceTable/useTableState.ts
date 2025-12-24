import { useState } from 'react';
import { Visit } from '@/types/LearningJourneyAttendanceTypes/visit';

export const useTableState = () => {
  const [expandedVisit, setExpandedVisit] = useState<Visit | null>(null);
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);
  const [editVisit, setEditVisit] = useState<Visit | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const openViewModal = (visit: Visit) => setExpandedVisit(visit);
  const closeViewModal = () => setExpandedVisit(null);

  const openAddModal = () => setIsAddVisitOpen(true);
  const closeAddModal = () => setIsAddVisitOpen(false);

  const openEditModal = (visit: Visit) => setEditVisit(visit);
  const closeEditModal = () => setEditVisit(null);

  const openFilterModal = () => setIsFilterOpen(true);
  const closeFilterModal = () => setIsFilterOpen(false);

  return {
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
  };
};