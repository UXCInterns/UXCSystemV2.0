import { useState, useEffect, useCallback } from 'react';
import type { Project } from '@/types/ProjectsTypes/project';

type ProjectsApiResponse = {
  projects: Project[];
  error?: string;
};

export const useProjectData = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const data: ProjectsApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch project');
      }

      const foundProject = data.projects.find((p: Project) => p.id === projectId);
      
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
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error, refetch: fetchProject };
};