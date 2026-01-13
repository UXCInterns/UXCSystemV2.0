"use client";

import React, { useState, useEffect } from "react";
import { Project, Profile } from "@/types/project";
import ProjectSidePanel from "./sections/ProjectSidePanel";
import TeamMemberModal from "./sections/TeamMemberModal";
import AddProjectPanel from "./sections/AddProjectPanel";
import ProjectsTableView from "./ProjectsTableView";
import { emitProjectUpdate, onProjectUpdate } from "@/lib/projectEvents";
import { supabase } from "../../../lib/supabase/supabaseClient";
import { useProjectManagement } from "@/hooks/projects/useProjectManagement";
import { useTeamManagement } from "@/hooks/projects/useTeamManagement";
import { getProjectStatusBadgeProps } from '@/utils/badgeHelpers';

export default function ProjectsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const pageSize = 7;

  // Custom hooks for project and team management
  const {
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
  } = useProjectManagement(selectedProject, projects, setProjects, setSelectedProject, profiles);

  const {
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
  } = useTeamManagement(showAddPanel, editedProject, profiles, setEditedProject);

  // Fetch profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch('/api/profiles');
        if (response.ok) {
          const data = await response.json();
          setProfiles(data.profiles || []);
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
      }
    };
    fetchProfiles();
  }, []);

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    
    // Listen for project updates from other components
    const unsubscribe = onProjectUpdate(() => {
      console.log('🔔 Project update event received, refetching...');
      fetchProjects();
    });

    // Listen for realtime project changes from database triggers
    console.log('👂 Setting up realtime listener for all projects');
    const channel = supabase
      .channel('all-projects')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          console.log('🔔 Project updated via database trigger:', payload.new);
          fetchProjects();
        }
      )
      .subscribe((status) => {
        console.log('📡 Projects realtime status:', status);
      });

    return () => {
      unsubscribe();
      channel.unsubscribe();
    };
  }, []);

  // Filter and paginate
  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleAddProjectSuccess = () => {
    fetchProjects();
    setNewProjectCoreTeam([]);
    setNewProjectSupportTeam([]);
    emitProjectUpdate();
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setIsEditing(false);
    setNewProjectCoreTeam([]);
    setNewProjectSupportTeam([]);
    setShowAddPanel(true);
  };

  const handleCloseAddPanel = () => {
    setShowAddPanel(false);
    setNewProjectCoreTeam([]);
    setNewProjectSupportTeam([]);
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditing(false);
    setShowAddPanel(false);
  };

  const currentProject = isEditing ? editedProject : selectedProject;
  const showSidePanel = !!(selectedProject || showAddPanel);

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Main Table */}
      <ProjectsTableView
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        loading={loading}
        error={error}
        paginatedProjects={paginatedProjects}
        filteredProjects={filteredProjects}
        currentPage={currentPage}
        totalPages={totalPages}
        showSidePanel={showSidePanel}
        onPageChange={setCurrentPage}
        onNewProject={handleNewProject}
        onSelectProject={handleSelectProject}
        getStatusBadgeProps={getProjectStatusBadgeProps}
      />

      {/* Side Panels */}
      {selectedProject && currentProject && !showAddPanel && (
        <ProjectSidePanel
          project={currentProject}
          isEditing={isEditing}
          profiles={profiles}
          showDropdown={showDropdown}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          onClose={() => setSelectedProject(null)}
          onUpdate={handleUpdateProject}
          onDropdownToggle={setShowDropdown}
          onUpdateManager={handleUpdateManager}
          onOpenTeamModal={handleOpenTeamModal}
          getStatusBadgeProps={getProjectStatusBadgeProps}
        />
      )}

      {showAddPanel && (
        <AddProjectPanel
          profiles={profiles}
          onClose={handleCloseAddPanel}
          onSuccess={handleAddProjectSuccess}
          onOpenTeamModal={handleOpenTeamModal}
          coreTeamMembers={newProjectCoreTeam}
          supportTeamMembers={newProjectSupportTeam}
        />
      )}

      {/* Team Modal */}
      {showTeamModal.type && (
        <TeamMemberModal
          type={showTeamModal.type}
          profiles={profiles}
          selectedMembers={selectedTeamMembers}
          onToggle={handleToggleTeamMember}
          onSave={handleSaveTeamMembers}
          onClose={closeTeamModal}
        />
      )}
    </div>
  );
}