// workshop.ts
export interface WorkshopsTableProps {
  data?: Workshop[];
  programTypeFilter?: "pace" | "non_pace";
}

export interface Workshop {
  id: string;
  course_program_title: string;
  program_start_date: string;
  program_end_date: string;
  no_of_participants: number;
  trainee_hours: number;
  program_type: string;
  school_dept: string;
  course_hours: number;
  company_sponsored_participants: number;
  run_number?: string;
  individual_group_participants?: number;
  course_type?: string;
  subsidy_description?: string;
  bia_level?: string;
  learning_outcome?: string;
  category?: string;
  csc?: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkshopFormData {
  id: string;
  program_type: string;
  school_dept: string;
  course_program_title: string;
  program_start_date: string;
  program_end_date: string;
  course_hours: number;
  no_of_participants: number;
  company_sponsored_participants: number;
  individual_group_participants: number;
  trainee_hours: number;
  run_number: string;
  course_type: string;
  subsidy_description: string;
  bia_level: string;
  learning_outcome: string;
  category: string;
  csc: boolean;
}

export interface WorkshopFilterOptions {
  programTypes: string[];
  schoolDepts: string[];
  courseTypes: string[];
  categories: string[];
  biaLevels: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  participantsRange: {
    min: number | null;
    max: number | null;
  };
  traineeHoursRange: {
    min: number | null;
    max: number | null;
  };
  courseHoursRange: {
    min: number | null;
    max: number | null;
  };
  cscOnly: boolean;
}

export interface AvailableFilterOptions {
  programTypes: string[];
  courseTypes: string[];
  categories: string[];
  biaLevels: string[];
}

export interface NewWorkshopFormData {
  program_type: string;
  school_dept: string;
  course_program_title: string;
  program_start_date: string;
  program_end_date: string;
  course_hours: number;
  no_of_participants: number;
  company_sponsored_participants: number;
  trainee_hours: number;
  run_number: string;
  individual_group_participants: number;
  course_type: string;
  subsidy_description: string;
  bia_level: string;
  learning_outcome: string;
  category: string;
  csc: boolean;
}

export interface EditWorkshopFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workshopData: Partial<Workshop>) => void;
  workshop?: Workshop | null;
}

export interface WorkshopFilterComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: WorkshopFilterOptions) => void;
  onClearFilters: () => void;
  currentFilters: WorkshopFilterOptions;
  availableOptions: AvailableFilterOptions;
  programTypeFilter: "pace" | "non_pace";
}

export interface NewWorkshopFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workshopData: NewWorkshopFormData) => Promise<void> | void;
}

export interface WorkshopDetailsModalProps {
  workshop: Workshop | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface WorkshopTableStatsProps {
  paginatedCount: number;
  sortedCount: number;
  filteredByTypeCount: number;
  programTypeFilter: "pace" | "non_pace";
  searchQuery: string;
  hasActiveFilters: boolean;
}

export interface WorkshopTableHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  activeFilterCount: number;
  onFilterClick: () => void;
  onAddClick: () => void;
  isLoading: boolean;
}

export interface WorkshopTableBodyProps {
  data: Workshop[];
  isLoading: boolean;
  programTypeFilter: "pace" | "non_pace";
  searchQuery: string;
  hasActiveFilters: boolean;
  onDetailsClick: (workshop: Workshop) => void;
  onEditClick: (workshop: Workshop) => void;
  onDeleteClick: (workshop: Workshop) => void;
}

export interface WorkshopsTablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface WorkshopTableState {
  searchQuery: string;
  sortBy: string;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export interface WorkshopsTableContentProps {
  tableState: WorkshopTableState;
  programTypeFilter: "pace" | "non_pace";
}

export interface WorkshopModalsProps {
  // Filter modal props
  isFilterOpen: boolean;
  onFilterClose: () => void;
  onApplyFilters: (filters: WorkshopFilterOptions) => void;
  onClearFilters: () => void;
  currentFilters: WorkshopFilterOptions;
  availableOptions: AvailableFilterOptions;
  programTypeFilter: "pace" | "non_pace";
  
  // New workshop modal props
  isNewOpen: boolean;
  onNewClose: () => void;
  onCreateWorkshop: (data: NewWorkshopFormData) => Promise<{ success: boolean; error?: string }>;
  
  // Edit workshop modal props
  isEditOpen: boolean;
  onEditClose: () => void;
  onUpdateWorkshop: (data: Partial<Workshop>) => Promise<{ success: boolean; error?: string }>;
  selectedWorkshopForEdit: Workshop | null;
  
  // Details modal props
  isDetailsOpen: boolean;
  onDetailsClose: () => void;
  selectedWorkshop: Workshop | null;
}