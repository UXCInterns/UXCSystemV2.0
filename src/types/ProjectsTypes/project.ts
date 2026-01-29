// src/types/ProjectsTypes/project.ts

// Type for team member data
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
};

export type Project = {
  id: string;
  project_name: string;
  project_description: string;
  project_manager: TeamMember;
  project_lead: TeamMember;
  core_team: TeamMember[];
  support_team: TeamMember[];
  start_date: string;
  end_date: string;
  progress: number;
  status: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
};