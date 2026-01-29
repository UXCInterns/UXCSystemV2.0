import { useCallback } from 'react';
import type { Visit, VisitFormData } from '@/types/LearningJourneyAttendanceTypes/visit';

interface VisitHandlersProps {
  addVisit: (visitData: Partial<Visit>) => Promise<{ success: boolean; error?: unknown }>;
  updateVisit: (visitData: Partial<Visit>) => Promise<{ success: boolean; error?: unknown }>;
  deleteVisit: (visitId: string) => Promise<{ success: boolean; error?: unknown; cancelled?: boolean }>;
  onAddSuccess: () => void;
  onEditSuccess: () => void;
}

export const useVisitHandlers = ({
  addVisit,
  updateVisit,
  deleteVisit,
  onAddSuccess,
  onEditSuccess,
}: VisitHandlersProps) => {
  
  const handleAddVisit = useCallback(async (visitData: Partial<VisitFormData>) => {
    const result = await addVisit(visitData);
    if (result.success) {
      onAddSuccess();
      console.log("Visit added successfully!");
    } else {
      const errorMessage = result.error instanceof Error 
        ? result.error.message 
        : "Failed to add visit";
      alert(errorMessage);
    }
  }, [addVisit, onAddSuccess]);

  const handleEditVisit = useCallback(async (visitData: Partial<Visit>) => {
    const result = await updateVisit(visitData);
    if (result.success) {
      onEditSuccess();
      console.log("Visit updated successfully!");
    } else {
      const errorMessage = result.error instanceof Error 
        ? result.error.message 
        : "Failed to update visit";
      alert(errorMessage);
    }
  }, [updateVisit, onEditSuccess]);

  const handleDeleteVisit = useCallback(async (visitId: string) => {
    const result = await deleteVisit(visitId);
    if (result.success) {
      console.log("Visit deleted successfully!");
    } else if (!result.cancelled) {
      const errorMessage = result.error instanceof Error 
        ? result.error.message 
        : "Failed to delete visit";
      alert(errorMessage);
    }
  }, [deleteVisit]);

  return {
    handleAddVisit,
    handleEditVisit,
    handleDeleteVisit,
  };
};