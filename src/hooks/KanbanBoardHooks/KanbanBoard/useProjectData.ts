import { useState, useEffect } from 'react';
import type { Profile, Project, TeamMember } from '@/types/ProjectsTypes/project';

// Type for the API response
type ProjectsApiResponse = {
  projects: Project[];
  error?: string;
};

export function useProjectData(projectId: string) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projectMembers, setProjectMembers] = useState<string[]>([]);
  const [projectName, setProjectName] = useState<string>('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('/api/projects');
        const data: ProjectsApiResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch projects');
        }

        const foundProject = data.projects.find((p: Project) => p.id === projectId);
        
        if (!foundProject) {
          console.error('Project not found');
          return;
        }

        // Set project name
        setProjectName(foundProject.project_name);

        const teamProfiles: Profile[] = [];
        const addedIds = new Set<string>();

        const addProfile = (member: TeamMember) => {
          if (member && member.id && !addedIds.has(member.id)) {
            teamProfiles.push({
              id: member.id,
              full_name: member.name,
              email: member.email,
              avatar_url: member.avatar_url || null,
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
            if (typeof member !== 'string') {
              addProfile(member);
            }
          });
        }

        if (Array.isArray(foundProject.support_team)) {
          foundProject.support_team.forEach((member) => {
            if (typeof member !== 'string') {
              addProfile(member);
            }
          });
        }

        setProfiles(teamProfiles);
        setProjectMembers(Array.from(addedIds));
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    if (projectId) {
      fetchProfiles();
    }
  }, [projectId]);

  return {
    profiles,
    projectMembers,
    projectName
  };
}