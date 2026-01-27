// src/types/visit.ts
// This is for the UXC LJ Attendance Table
export interface Visit {
  id: string;
  company_name: string;
  date_of_visit: string;
  total_attended: number;
  total_registered: number;
  uen_number: string;
  start_time: string;
  end_time: string;
  duration: string;
  session_type: string;
  consultancy: boolean;
  training: boolean;
  revenue: number;
  sector: string;
  size: string;
  industry: string;
  notes: string;
  pace: boolean;
  informal: boolean;
  created_at: string;
  updated_at: string;
  conversion_status: string;
}

export interface VisitDetailsModalProps {
  visit: Visit | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterOptions {
  sessionTypes: string[];
  sectors: string[];
  industries: string[];
  companySizes: string[];
  dateRange: { startDate: string; endDate: string };
  attendedRange: { min: number | null; max: number | null };
}

export interface FilterComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  currentFilters: FilterOptions;
}

export interface VisitFormData {
  company_name: string | null;
  uen_number: string | null;
  industry: string | null;
  sector: string | null;
  size: string | null;
  date_of_visit: string | null;
  start_time: string | null;
  end_time: string | null;
  duration: string | null;
  session_type: string | null;
  total_registered: number;
  total_attended: number;
  consultancy: boolean;
  training: boolean;
  revenue: number;
  pace: boolean;
  informal: boolean;
  notes: string | null;
}

export interface NewVisitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (visitData: VisitFormData) => void;
}

export type FormErrors = Record<string, string>;

export interface TableActionHandlers {
  onView: (visit: Visit) => void;
  onEdit: (visit: Visit) => void;
  onDelete: (visitId: string) => void;
}

export interface TableState {
  expandedVisit: Visit | null;
  isAddVisitOpen: boolean;
  editVisit: Visit | null;
  isFilterOpen: boolean;
}

export interface FilterState {
  sessionTypes: string[];
  sectors: string[];
  industries: string[];
  companySizes: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  attendedRange: {
    min: number | null;
    max: number | null;
  };
}

export interface EditVisitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (visitData: VisitFormData) => void;
  visit?: Visit | null;
}