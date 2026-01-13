// src/types/project.ts
export type Project = {
  id: string;
  project_name: string;
  project_description: string;
  project_manager: { id: string; name: string; email: string; avatar_url?: string | null; };
  project_lead: { id: string; name: string; email: string; avatar_url?: string | null; };
  core_team: Array<{ id: string; name: string; email: string; avatar_url?: string | null;}> | string[];
  support_team: Array<{ id: string; name: string; email: string; avatar_url?: string | null; }> | string[];
  start_date: string;
  end_date: string;
  progress: number;
  status: string;
  notes: string;
};

export type Profile = {
  avatar_url?: string | null; // Changed from string | undefined to string | null | undefined
  id: string;
  full_name: string;
  email: string;
};