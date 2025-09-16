// src/hooks/useVisits.ts
// This is for the UXC LJ Attendance Table

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Visit } from '../../types/visit';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

export const useVisits = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: rawData, error, isLoading: swrLoading } = useSWR('/api/learning-journeys', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  // Helper functions
  const computeConversionStatus = (consultancy: boolean, training: boolean) => {
    if (consultancy && training) return "Both";
    if (consultancy) return "Consultancy";
    if (training) return "Training";
    return "No Conversion";
  };

  const mapVisitData = (row: any): Visit => ({
    id: row.id,
    company_name: row.company_name,
    date_of_visit: row.date_of_visit,
    total_attended: row.total_attended,
    total_registered: row.total_registered,
    uen_number: row.uen_number || "-",
    start_time: row.start_time,
    end_time: row.end_time,
    duration: row.duration || "-",
    session_type: row.session_type || "-",
    consultancy: row.consultancy,
    training: row.training,
    revenue: row.revenue || 0,
    sector: row.sector || "-",
    size: row.size || "-",
    industry: row.industry || "-",
    notes: row.notes || "",
    pace: row.pace,
    informal: row.informal,
    created_at: row.created_at,
    updated_at: row.updated_at,
    conversion_status: computeConversionStatus(row.consultancy, row.training),
  });

  const visits = rawData ? rawData.map(mapVisitData) : [];

  // CRUD operations
  const addVisit = async (visitData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/learning-journeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add visit");
      }

      mutate('/api/learning-journeys');
      return { success: true };
    } catch (error) {
      console.error("Error adding visit:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const updateVisit = async (visitData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/learning-journeys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update visit");
      }

      mutate('/api/learning-journeys');
      return { success: true };
    } catch (error) {
      console.error("Error updating visit:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVisit = async (visitId: string) => {
    if (!confirm("Are you sure you want to delete this visit? This action cannot be undone.")) {
      return { success: false, cancelled: true };
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/learning-journeys?id=${visitId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete visit");
      }

      mutate('/api/learning-journeys');
      return { success: true };
    } catch (error) {
      console.error("Error deleting visit:", error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    visits,
    isLoading: swrLoading || isLoading,
    error,
    addVisit,
    updateVisit,
    deleteVisit,
  };
};