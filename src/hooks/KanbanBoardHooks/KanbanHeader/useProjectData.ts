import { useState, useEffect } from 'react';

type Profile = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
};

export type Project = {
  id: string;
  project_name: string;
  project_description?: string;
  project_manager: Profile;
  project_lead: Profile;
  core_team: Profile[];
  support_team: Profile[];
  start_date: string;
  end_date: string;
  progress: number;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export const useProjectData = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch project');
      }

      const foundProject = data.projects.find((p: any) => p.id === projectId);
      
      if (!foundProject) {
        throw new Error('Project not found');
      }

      setProject(foundProject);
      setError(null);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  return { project, loading, error };
};