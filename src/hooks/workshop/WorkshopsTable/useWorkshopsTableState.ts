import { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { useWorkshopFilters } from "@/hooks/workshop/useWorkshopFilters";
import { useWorkshopData } from "@/hooks/workshop/useWorkshopData";
import { useWorkshopModals } from "@/hooks/workshop/useWorkshopModals";
import { useWorkshopPagination } from "@/hooks/workshop/useWorkshopPagination";
import { ITEMS_PER_PAGE } from "@/constants/workshopConstants";
import { WorkshopFilterOptions } from "@/types/workshop";

export const useWorkshopsTableState = (data: any[], programTypeFilter: "pace" | "non_pace") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Custom hooks for data management
  const {
    tableData,
    isLoading,
    fetchWorkshops,
    handleCreateWorkshop,
    handleUpdateWorkshop,
    handleDeleteWorkshop
  } = useWorkshopData(data);

  // Filter management
  const {
    activeFilters,
    setActiveFilters,
    availableFilterOptions,
    applyFilters,
    hasActiveFilters,
    activeFilterCount,
    clearFilters,
    removeFilter,
  } = useWorkshopFilters(tableData);

  // Modal management
  const {
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
  } = useWorkshopModals();

  const { isOpen, openModal, closeModal } = useModal();

  // Data processing and pagination logic
  const {
    paginatedData,
    sortedData,
    totalPages,
    filteredByTypeData
  } = useWorkshopPagination(
    tableData,
    searchQuery,
    sortBy,
    currentPage,
    programTypeFilter,
    activeFilters,
    ITEMS_PER_PAGE,
    applyFilters
  );

  // Clear irrelevant filters when programTypeFilter changes
  useEffect(() => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      
      if (programTypeFilter === "pace") {
        newFilters.cscOnly = false;
      } else if (programTypeFilter === "non_pace") {
        newFilters.categories = [];
      }
      
      return newFilters;
    });
    setCurrentPage(1);
  }, [programTypeFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, programTypeFilter, activeFilters]);

  const handleApplyFilters = (filters: WorkshopFilterOptions) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    clearFilters();
    setCurrentPage(1);
  };

  const handleRemoveFilter = (filterType: string, value?: string) => {
    removeFilter(filterType, value);
  };

  return {
    // State
    searchQuery,
    sortBy,
    currentPage,
    setSearchQuery,
    setSortBy,
    setCurrentPage,
    
    // Data
    tableData,
    paginatedData,
    sortedData,
    filteredByTypeData,
    isLoading,
    
    // Filters
    activeFilters,
    availableFilterOptions,
    hasActiveFilters,
    activeFilterCount,
    handleApplyFilters,
    handleClearFilters,
    handleRemoveFilter,
    
    // Modals
    isFilterOpen,
    setIsFilterOpen,
    isOpen,
    openModal,
    closeModal,
    isDetailsOpen,
    isEditOpen,
    selectedWorkshop,
    selectedWorkshopForEdit,
    openDetailsModal,
    closeDetailsModal,
    openEditModal,
    closeEditModal,
    
    // Actions
    handleCreateWorkshop,
    handleUpdateWorkshop,
    handleDeleteWorkshop,
    
    // Pagination
    totalPages,
  };
};