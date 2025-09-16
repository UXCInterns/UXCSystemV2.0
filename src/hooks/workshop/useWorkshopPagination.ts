// hooks/useWorkshopPagination.ts
import { useMemo } from 'react';
import { Workshop } from '@/types/workshop';

export const useWorkshopPagination = (
  tableData: Workshop[],
  searchQuery: string,
  sortBy: string,
  currentPage: number,
  programTypeFilter: "pace" | "non_pace",
  activeFilters: any,
  itemsPerPage: number,
  applyFilters: (data: Workshop[], filters: any) => Workshop[]
) => {
  return useMemo(() => {
    // First filter by program type
    const typeFilteredData = tableData.filter((row) =>
      row.program_type === programTypeFilter
    );

    // Apply custom filters
    const customFilteredData = applyFilters(typeFilteredData, activeFilters);

    // Apply search filter
    const searchFilteredData = customFilteredData.filter((row) =>
      row.course_program_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply sorting
    const dataCopy = [...searchFilteredData];
    let sorted: Workshop[];
    
    switch (sortBy) {
      case "Newest":
        sorted = dataCopy.sort(
          (a, b) =>
            new Date(b.program_start_date).getTime() - new Date(a.program_start_date).getTime()
        );
        break;
      case "Oldest":
        sorted = dataCopy.sort(
          (a, b) =>
            new Date(a.program_start_date).getTime() - new Date(b.program_start_date).getTime()
        );
        break;
      case "Most Trainee Hours":
        sorted = dataCopy.sort((a, b) => b.trainee_hours - a.trainee_hours);
        break;
      case "Least Trainee Hours":
        sorted = dataCopy.sort((a, b) => a.trainee_hours - b.trainee_hours);
        break;
      case "Most Participants":
        sorted = dataCopy.sort((a, b) => b.no_of_participants - a.no_of_participants);
        break;
      case "Least Participants":
        sorted = dataCopy.sort((a, b) => a.no_of_participants - b.no_of_participants);
        break;
      default:
        sorted = dataCopy;
    }

    // Calculate pagination
    const totalPagesCount = Math.ceil(sorted.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = sorted.slice(startIndex, endIndex);

    return {
      paginatedData: paginated,
      sortedData: sorted,
      totalPages: totalPagesCount,
      filteredByTypeData: typeFilteredData,
    };
  }, [tableData, searchQuery, sortBy, currentPage, programTypeFilter, activeFilters, itemsPerPage, applyFilters]);
};