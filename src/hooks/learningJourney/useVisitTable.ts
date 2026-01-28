// src/hooks/useVisitTable.ts
// This is for the UXC LJ Attendance Table

import { useState, useEffect } from 'react';
import { Visit } from '../../types/LearningJourneyAttendanceTypes/visit';

export const useVisitTable = (visits: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const sortOptions = ["Newest", "Oldest", "Most Attended", "Least Attended"];

  const getSortedData = (data: Visit[]) => {
    const dataCopy = [...data];
    switch (sortBy) {
      case "Newest":
        return dataCopy.sort(
          (a, b) => new Date(b.date_of_visit).getTime() - new Date(a.date_of_visit).getTime()
        );
      case "Oldest":
        return dataCopy.sort(
          (a, b) => new Date(a.date_of_visit).getTime() - new Date(b.date_of_visit).getTime()
        );
      case "Most Attended":
        return dataCopy.sort((a, b) => b.total_attended - a.total_attended);
      case "Least Attended":
        return dataCopy.sort((a, b) => a.total_attended - b.total_attended);
      default:
        return dataCopy;
    }
  };

  const processTableData = (filteredVisits: Visit[]) => {
    // Apply search
    const searchedData = filteredVisits.filter((row: Visit) =>
      row.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply sorting
    const sortedData = getSortedData(searchedData);

    // Calculate pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return {
      searchedData,
      sortedData,
      paginatedData,
      totalPages
    };
  };

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    sortOptions,
    processTableData,
  };
};