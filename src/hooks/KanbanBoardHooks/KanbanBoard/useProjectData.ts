import { useState, useEffect } from 'react';
import type { Profile } from '@/types/ProjectsTypes/project';

export function useProjectData(projectId: string) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [projectMembers, setProjectMembers] = useState<string[]>([]);
  const [projectName, setProjectName] = useState<string>('');

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch projects');
        }

        const foundProject = data.projects.find((p: any) => p.id === projectId);
        
        if (!foundProject) {
          console.error('Project not found');
          return;
        }

        // Set project name
        setProjectName(foundProject.project_name);

        const teamProfiles: Profile[] = [];
        const addedIds = new Set<string>();

        const addProfile = (member: any) => {
          if (member && member.id && !addedIds.has(member.id)) {
            teamProfiles.push({
              id: member.id,
              full_name: member.name,
              email: member.email,
              avatar_url: member.avatar_url || undefined,
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
          foundProject.core_team.forEach(addProfile);
        }

        if (Array.isArray(foundProject.support_team)) {
          foundProject.support_team.forEach(addProfile);
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