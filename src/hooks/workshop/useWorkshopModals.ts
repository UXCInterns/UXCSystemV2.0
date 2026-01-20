// hooks/useWorkshopModals.ts
import { useState } from 'react';
import { Workshop } from '@/types/WorkshopTypes/workshop';

export const useWorkshopModals = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedWorkshopForEdit, setSelectedWorkshopForEdit] = useState<Workshop | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const openDetailsModal = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsOpen(false);
    setSelectedWorkshop(null);
  };

  const openEditModal = (workshop: Workshop) => {
    setSelectedWorkshopForEdit(workshop);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedWorkshopForEdit(null);
  };

  return {
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
  };
};