//src/types/project.ts

export type ProjectMember = {
  id: string;
  project_id: string;
  role: string;
};

//projects table 
export interface Project {
  project_id: string;
  project_name: string;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
  project_members?: ProjectMember[];
}