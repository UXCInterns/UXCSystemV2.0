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

export interface FilterOptions {
  sessionTypes: string[];
  sectors: string[];
  industries: string[];
  companySizes: string[];
  dateRange: { startDate: string; endDate: string };
  attendedRange: { min: number | null; max: number | null };
}