// hooks/useWorkshopData.ts
import { useState, useEffect } from 'react';
import { Workshop } from '@/types/WorkshopTypes/workshop';

export const useWorkshopData = (initialData: Workshop[]) => {
  const [tableData, setTableData] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize data
  useEffect(() => {
    if (initialData.length === 0) {
      fetchWorkshops();
    } else {
      setTableData(initialData);
    }
  }, [initialData]);

  const fetchWorkshops = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/workshops');
      if (response.ok) {
        const workshops = await response.json();
        setTableData(workshops);
      } else {
        console.error('Failed to fetch workshops');
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWorkshop = async (workshopData: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/workshops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workshopData),
      });

      if (response.ok) {
        const newWorkshop = await response.json();
        setTableData(prev => [newWorkshop, ...prev]);
        return { success: true };
      } else {
        const error = await response.json();
        console.error('Failed to create workshop:', error);
        return { success: false, error: error.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error creating workshop:', error);
      return { success: false, error: 'Error creating workshop. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateWorkshop = async (workshopData: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/workshops', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workshopData),
      });

      if (response.ok) {
        const updatedWorkshop = await response.json();
        setTableData(prev => prev.map(w => 
          w.id === updatedWorkshop.id ? updatedWorkshop : w
        ));
        return { success: true };
      } else {
        const error = await response.json();
        console.error('Failed to update workshop:', error);
        return { success: false, error: error.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error updating workshop:', error);
      return { success: false, error: 'Error updating workshop. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkshop = async (workshop: Workshop) => {
    if (!confirm(`Are you sure you want to delete "${workshop.course_program_title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/workshops?id=${workshop.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTableData(prev => prev.filter(w => w.id !== workshop.id));
        alert('Workshop deleted successfully!');
      } else {
        const error = await response.json();
        console.error('Failed to delete workshop:', error);
        alert('Failed to delete workshop: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting workshop:', error);
      alert('Error deleting workshop. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tableData,
    isLoading,
    fetchWorkshops,
    handleCreateWorkshop,
    handleUpdateWorkshop,
    handleDeleteWorkshop
  };
};