// Hook for managing manpower filtering and pagination state
import { useState, useEffect, useMemo } from "react";
import { ManpowerRecord, StatusFilter } from "@/types/ManpowerTypes/manpower";
import { computeStatus } from "@/utils/ManpowerUtils/ManpowerTableUtils/manpowerStatus";

interface UseManpowerFiltersProps {
  manpower: ManpowerRecord[];
  pageSize?: number;
}

export const useManpowerFilters = ({ 
  manpower, 
  pageSize = 10 
}: UseManpowerFiltersProps) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredManpower = useMemo(() => {
    return manpower.filter((person) => {
      const matchesStatus = 
        statusFilter === "All" || computeStatus(person) === statusFilter;
      return matchesStatus;
    });
  }, [manpower, statusFilter]);

  const totalPages = Math.ceil(filteredManpower.length / pageSize);
  
  const paginatedManpower = useMemo(() => {
    return filteredManpower.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredManpower, currentPage, pageSize]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  return {
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    filteredManpower,
    paginatedManpower,
    totalPages,
  };
};
