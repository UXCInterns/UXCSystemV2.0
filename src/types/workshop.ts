// workshop.ts
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

export interface WorkshopsTableProps {
  data?: Workshop[];
  programTypeFilter?: "pace" | "non_pace";
}