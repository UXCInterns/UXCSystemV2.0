import { useState } from "react";
import { Project, Profile } from "@/types/project";
import { emitProjectUpdate } from "@/lib/projectEvents";

export function useTeamManagement(
  showAddPanel: boolean,
  editedProject: Project | null,
  profiles: Profile[],
  setEditedProject: (project: Project | null) => void
) {
  const [showTeamModal, setShowTeamModal] = useState<{ 
    type: 'core' | 'support' | null; 
    isNewProject: boolean 
  }>({ type: null, isNewProject: false });
  
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([]);
  const [newProjectCoreTeam, setNewProjectCoreTeam] = useState<string[]>([]);
  const [newProjectSupportTeam, setNewProjectSupportTeam] = useState<string[]>([]);

  const handleOpenTeamModal = (type: 'core' | 'support') => {
    if (showAddPanel) {
      // For new project
      const currentTeam = type === 'core' ? newProjectCoreTeam : newProjectSupportTeam;
      setSelectedTeamMembers(currentTeam);
      setShowTeamModal({ type, isNewProject: true });
    } else if (editedProject) {
      // For existing project
      const currentTeam = type === 'core' ? editedProject.core_team : editedProject.support_team;
      const currentIds = currentTeam.map(m => typeof m === 'string' ? m : m.id);
      setSelectedTeamMembers(currentIds);
      setShowTeamModal({ type, isNewProject: false });
    }
  };

  const handleToggleTeamMember = (profileId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(profileId) 
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSaveTeamMembers = async () => {
    if (!showTeamModal.type) return;

    if (showTeamModal.isNewProject) {
      // For new project, just update state
      if (showTeamModal.type === 'core') {
        setNewProjectCoreTeam(selectedTeamMembers);
      } else {
        setNewProjectSupportTeam(selectedTeamMembers);
      }
      setShowTeamModal({ type: null, isNewProject: false });
    } else if (editedProject) {
      // For existing project, make API calls
      const teamType = showTeamModal.type;
      const currentTeam = teamType === 'core' ? editedProject.core_team : editedProject.support_team;
      const currentIds = currentTeam.map(m => typeof m === 'string' ? m : m.id);

      const toAdd = selectedTeamMembers.filter(id => !currentIds.includes(id));
      const toRemove = currentIds.filter(id => !selectedTeamMembers.includes(id));

      try {
        for (const profileId of toAdd) {
          await fetch(`/api/projects/${editedProject.id}/team`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile_id: profileId, team_type: teamType }),
          });
        }

        for (const profileId of toRemove) {
          await fetch(`/api/projects/${editedProject.id}/team?profile_id=${profileId}&team_type=${teamType}`, {
            method: 'DELETE',
          });
        }

        const updatedTeam = profiles.filter(p => selectedTeamMembers.includes(p.id)).map(p => ({
          id: p.id,
          name: p.full_name,
          email: p.email,
          avatar_url: p.avatar_url
        }));

        if (teamType === 'core') {
          setEditedProject({ ...editedProject, core_team: updatedTeam });
        } else {
          setEditedProject({ ...editedProject, support_team: updatedTeam });
        }

        setShowTeamModal({ type: null, isNewProject: false });
        emitProjectUpdate();
      } catch (err) {
        console.error('Error updating team:', err);
        alert('Error updating team members');
      }
    }
  };

  const closeTeamModal = () => {
    setShowTeamModal({ type: null, isNewProject: false });
  };

  return {
    showTeamModal,
    selectedTeamMembers,
    newProjectCoreTeam,
    newProjectSupportTeam,
    handleOpenTeamModal,
    handleToggleTeamMember,
    handleSaveTeamMembers,
    setNewProjectCoreTeam,
    setNewProjectSupportTeam,
    closeTeamModal
  };
}