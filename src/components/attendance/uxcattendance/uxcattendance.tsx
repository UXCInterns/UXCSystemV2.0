"use client";

import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Pagination from "@/components/common/Pagination";
import FilterComponent from "./FilterComponent";
import VisitDetailsModal from "./ViewDetails";
import NewVisitForm from "./NewVisitForm";
import EditVisitForm from "./EditVisitForm";

// Import our custom hooks and components
import { useVisits } from '@/hooks/learningJourney/useVisits';
import { useVisitFilters } from '@/hooks/learningJourney/useVisitFilters';
import { useVisitTable } from '@/hooks/learningJourney/useVisitTable';
import { VisitTableHeader } from './VisitTableHeader';
import { ActiveFilters } from './ActiveFilters';
import { Visit } from '@/types/visit';

const UXCAttendanceTable: React.FC = () => {
  // Modal states
  const [expandedVisit, setExpandedVisit] = useState<Visit | null>(null);
  const [isAddVisitOpen, setIsAddVisitOpen] = useState(false);
  const [editVisit, setEditVisit] = useState<Visit | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Custom hooks
  const { visits, isLoading, error, addVisit, updateVisit, deleteVisit } = useVisits();
  const {
    activeFilters,
    setActiveFilters,
    availableFilterOptions,
    applyFilters,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
  } = useVisitFilters(visits);
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    sortOptions,
    processTableData,
  } = useVisitTable(visits);

  // Process data through filters, search, and pagination
  const filteredData = useMemo(() => {
    return applyFilters(visits, activeFilters);
  }, [visits, activeFilters, applyFilters]);

  const { paginatedData, sortedData, totalPages } = useMemo(() => {
    return processTableData(filteredData);
  }, [filteredData, processTableData, searchQuery, sortBy, currentPage]);

  // Event handlers
  const handleAddVisit = async (visitData: any) => {
    const result = await addVisit(visitData);
    if (result.success) {
      setIsAddVisitOpen(false);
      console.log("Visit added successfully!");
    } else {
      const errorMessage = result.error instanceof Error ? result.error.message : "Failed to add visit";
      alert(errorMessage);
    }
  };

  const handleEditVisit = async (visitData: any) => {
    const result = await updateVisit(visitData);
    if (result.success) {
      setEditVisit(null);
      console.log("Visit updated successfully!");
    } else {
      const errorMessage = result.error instanceof Error ? result.error.message : "Failed to update visit";
      alert(errorMessage);
    }
  };

  const handleDeleteVisit = async (visitId: string) => {
    const result = await deleteVisit(visitId);
    if (result.success) {
      console.log("Visit deleted successfully!");
    } else if (!result.cancelled) {
      const errorMessage = result.error instanceof Error ? result.error.message : "Failed to delete visit";
      alert(errorMessage);
    }
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  const handleRemoveFilter = (filterType: string, value?: string) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      
      switch (filterType) {
        case 'sessionTypes':
          updated.sessionTypes = prev.sessionTypes.filter(t => t !== value);
          break;
        case 'sectors':
          updated.sectors = prev.sectors.filter(s => s !== value);
          break;
        case 'industries':
          updated.industries = prev.industries.filter(i => i !== value);
          break;
        case 'companySizes':
          updated.companySizes = prev.companySizes.filter(s => s !== value);
          break;
        case 'dateRange':
          updated.dateRange = { startDate: '', endDate: '' };
          break;
        case 'attendedRange':
          updated.attendedRange = { min: null, max: null };
          break;
      }
      
      return updated;
    });
  };

  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Error loading visits: {error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-auto overflow-x-auto">
        <VisitTableHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          sortOptions={sortOptions}
          onSortChange={setSortBy}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onFilterClick={() => setIsFilterOpen(true)}
          onAddVisitClick={() => setIsAddVisitOpen(true)}
          isLoading={isLoading}
        />

        {hasActiveFilters && (
          <ActiveFilters
            filters={activeFilters}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearFilters}
          />
        )}

        <div className="px-3 pb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {paginatedData.length} of {sortedData.length} visits
            {hasActiveFilters && ` (filtered from ${visits.length} total)`}
          </span>
        </div>

        <Table className="table-fixed">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-200 dark:bg-gray-900">
            <TableRow>
              {["Company Name", "Date of Visit", "Total Attended", "Duration", "Conversion", "Actions"].map((header) => (
                <TableCell
                  key={header}
                  isHeader
                  className={`px-4 py-3 font-large text-gray-500 text-theme-sm dark:text-gray-400 ${
                    header === "Company Name" ? "text-start" : "text-center"
                  }`}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] group">
            {isLoading ? (
              <TableRow>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500"></div>
                    <span className="ml-2">Loading workshops...</span>
                  </div>
                </td>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <td colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                  {hasActiveFilters || searchQuery 
                    ? "No visits match your current filters or search criteria." 
                    : "No visits found."
                  }
                </td>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-opacity duration-200 group-hover:opacity-30 hover:!opacity-100"
                >
                  <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90 max-w-[200px] truncate overflow-hidden whitespace-nowrap">
                    {row.company_name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    {new Date(row.date_of_visit).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400 flex justify-center items-center gap-1">
                    {row.total_attended}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    {row.duration}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    {row.conversion_status}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                    <div className="flex justify-center gap-5 items-center">
                      <button
                        aria-label="View Details"
                        className="hover:text-green-600 dark:hover:text-green-400 disabled:opacity-50"
                        onClick={() => setExpandedVisit(row)}
                        disabled={isLoading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M17 2a1 1 0 1 0 0 2h1.586l-4.293 4.293a1 1 0 0 0 1.414 1.414L20 5.414V7a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1h-4zM4 18.586V17a1 1 0 1 0-2 0v4a1 1 0 0 0 1 1h4a1 1 0 1 0 0-2H5.414l4.293-4.293a1 1 0 0 0-1.414-1.414L4 18.586z" />
                        </svg>
                      </button>
                      <button
                        aria-label="Edit"
                        className="hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                        onClick={() => setEditVisit(row)}
                        disabled={isLoading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 576 512">
                          <path fill="currentColor" d="m402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9L216.2 301.8l-7.3 65.3l65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1l30.9-30.9c4-4.2 4-10.8-.1-14.9z"/>
                        </svg>
                      </button>
                      <button
                        aria-label="Delete"
                        className="hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                        onClick={() => handleDeleteVisit(row.id)}
                        disabled={isLoading}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48">
                          <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
                            <path d="M9 10v34h30V10H9Z"/>
                            <path strokeLinecap="round" d="M20 20v13m8-13v13M4 10h40"/>
                            <path d="m16 10l3.289-6h9.488L32 10H16Z"/>
                          </g>
                        </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <FilterComponent
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        currentFilters={activeFilters}
      />

      <VisitDetailsModal
        visit={expandedVisit}
        isOpen={!!expandedVisit}
        onClose={() => setExpandedVisit(null)}
      />

      <NewVisitForm
        isOpen={isAddVisitOpen}
        onClose={() => setIsAddVisitOpen(false)}
        onSubmit={handleAddVisit}
      />

      <EditVisitForm
        isOpen={!!editVisit}
        onClose={() => setEditVisit(null)}
        onSubmit={handleEditVisit}
        visit={editVisit}
      />
    </div>
  );
};

export default UXCAttendanceTable;