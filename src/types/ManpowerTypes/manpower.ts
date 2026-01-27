// Type definitions for manpower-related data structures
export type ManpowerRecord = {
  profile_id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  projects_as_manager: number;
  projects_as_lead: number;
  projects_as_core_team: number;
  projects_as_support_team: number;
  total_projects: number;
  tasks_assigned: number;
  active_projects_count: number;
};

export type ManpowerAllocation = {
  profile_id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  projects_as_manager: number;
  projects_as_lead: number;
  projects_as_core_team: number;
  projects_as_support_team: number;
  total_projects: number;
  tasks_assigned: number;
  active_projects_count: number;
};

export type Project = {
  project_id: string;
  project_name: string;
  project_status: string;
  roles: string[]; // Array of roles the user has on this project
  tasks_assigned: number;
  start_date: string;
  end_date: string | null;
};

export type StatusType = "Available" | "Busy" | "Overloaded";

export type StatusFilter = "All" | "Available" | "Busy" | "Overloaded";

export type RoleBadge = {
  label: string;
  count: number;
  color: string;
};

export type StatusDistribution = {
  status: StatusType;
  count: number;
};