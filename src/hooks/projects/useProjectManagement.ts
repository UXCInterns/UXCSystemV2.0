import { useState } from "react";
import { Project, Profile } from "@/types/project";
import { emitProjectUpdate } from "@/lib/projectEvents";

export function useProjectManagement(
  selectedProject: Project | null,
  projects: Project[],
  setProjects: (projects: Project[]) => void,
  setSelectedProject: (project: Project | null) => void,
  profiles: Profile[]
) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProject(selectedProject);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProject(null);
  };

  const handleSaveEdit = async () => {
    if (!editedProject) return;

    try {
      const response = await fetch(`/api/projects/${editedProject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_name: editedProject.project_name,
          project_description: editedProject.project_description,
          project_manager_id: editedProject.project_manager.id,
          project_lead_id: editedProject.project_lead.id,
          start_date: editedProject.start_date,
          end_date: editedProject.end_date,
          notes: editedProject.notes,
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setProjects(projects.map(p => p.id === updated.id ? updated : p));
        setSelectedProject(updated);
        setIsEditing(false);
        setEditedProject(null);
        emitProjectUpdate();
      } else {
        alert('Failed to update project');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Error updating project');
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    
    if (!confirm(`Are you sure you want to delete "${selectedProject.project_name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter(p => p.id !== selectedProject.id));
        setSelectedProject(null);
        emitProjectUpdate();
      } else {
        alert('Failed to delete project');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Error deleting project');
    }
  };

  const handleUpdateProject = (updates: Partial<Project>) => {
    if (!editedProject) return;
    setEditedProject({ ...editedProject, ...updates });
  };

  const handleUpdateManager = (profileId: string, role: 'manager' | 'lead') => {
    if (!editedProject) return;
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;

    if (role === 'manager') {
      setEditedProject({
        ...editedProject,
        project_manager: { 
          id: profile.id, 
          name: profile.full_name, 
          email: profile.email,
          avatar_url: profile.avatar_url
        }
      });
    } else {
      setEditedProject({
        ...editedProject,
        project_lead: { 
          id: profile.id, 
          name: profile.full_name, 
          email: profile.email,
          avatar_url: profile.avatar_url
        }
      });
    }
    setShowDropdown(null);
  };

  return {
    isEditing,
    editedProject,
    showDropdown,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleDelete,
    handleUpdateProject,
    handleUpdateManager,
    setShowDropdown,
    setIsEditing,
    setEditedProject
  };
}