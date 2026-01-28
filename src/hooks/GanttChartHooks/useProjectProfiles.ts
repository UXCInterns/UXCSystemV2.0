import { useState, useEffect } from 'react';
import type { Project, Profile, TeamMember } from '@/types/ProjectsTypes/project';

// Define the team member structure from API (matches your Project type)
interface ApiResponse {
  projects: Project[];
  error?: string;
}

export const useProjectProfiles = (projectId: string) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectProfiles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        const data: ApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch projects');
        }

        const foundProject = data.projects.find((p) => p.id === projectId);
        
        if (!foundProject) {
          console.error('Project not found');
          setProfiles([]);
          return;
        }

        const teamProfiles: Profile[] = [];
        const addedIds = new Set<string>();

        const addProfile = (member: TeamMember | undefined) => {
          if (member && member.id && !addedIds.has(member.id)) {
            teamProfiles.push({
              id: member.id,
              full_name: member.name,
              email: member.email,
              avatar_url: member.avatar_url ?? undefined,
            });
            addedIds.add(member.id);
          }
        };

        if (foundProject.project_manager) {
          addProfile(foundProject.project_manager);
        }

        if (foundProject.project_lead) {
          addProfile(foundProject.project_lead);
        }

        if (Array.isArray(foundProject.core_team)) {
          foundProject.core_team.forEach((member) => {
            // Handle both object and string types
            if (typeof member === 'object' && member !== null) {
              addProfile(member);
            }
          });
        }

        if (Array.isArray(foundProject.support_team)) {
          foundProject.support_team.forEach((member) => {
            // Handle both object and string types
            if (typeof member === 'object' && member !== null) {
              addProfile(member);
            }
          });
        }

        setProfiles(teamProfiles);
        setError(null);
      } catch (error) {
        console.error('Error fetching project profiles:', error);
        setError('Failed to load team profiles');
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (projectId) {
      fetchProjectProfiles();
    }
  }, [projectId]);

  return { profiles, loading, error };
};