"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { Profile } from "@/types/ProjectsTypes/project";
import AddProjectBasicInfo from "./AddProjectBasicInfo";
import AddProjectDates from "./AddProjectDates";
import AddProjectTeam from "./AddProjectTeam";
import AddProjectDescription from "./AddProjectDescription";
import AddProjectNotes from "./AddProjectNotes";

interface AddProjectPanelProps {
  profiles: Profile[];
  onClose: () => void;
  onSuccess: () => void;
  onOpenTeamModal: (type: 'core' | 'support') => void;
  coreTeamMembers: string[];
  supportTeamMembers: string[];
}

export default function AddProjectPanel({ 
  profiles, 
  onClose, 
  onSuccess,
  onOpenTeamModal,
  coreTeamMembers,
  supportTeamMembers
}: AddProjectPanelProps) {
  const [formData, setFormData] = useState({
    project_name: "",
    project_description: "",
    project_manager_id: "",
    project_lead_id: "",
    start_date: "",
    end_date: "",
    progress: 0,
    status: "Not Started",
    notes: "",
  });
  
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.project_name.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the project first
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          project_manager_id: formData.project_manager_id || null,
          project_lead_id: formData.project_lead_id || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const result = await response.json();
      const projectId = result.project.id;

      // Add core team members
      for (const profileId of coreTeamMembers) {
        await fetch(`/api/projects/${projectId}/team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_id: profileId, team_type: 'core' }),
        });
      }

      // Add support team members
      for (const profileId of supportTeamMembers) {
        await fetch(`/api/projects/${projectId}/team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_id: profileId, team_type: 'support' }),
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-[420px] flex-shrink-0 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05] flex items-center justify-between">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white/90">
          New Project
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors disabled:opacity-50"
            title="Save"
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <AddProjectBasicInfo
            formData={formData}
            onUpdate={handleUpdate}
          />

          <AddProjectDates
            formData={formData}
            onUpdate={handleUpdate}
          />

          <AddProjectTeam
            formData={formData}
            profiles={profiles}
            showDropdown={showDropdown}
            coreTeamMembers={coreTeamMembers}
            supportTeamMembers={supportTeamMembers}
            onUpdate={handleUpdate}
            onDropdownToggle={setShowDropdown}
            onOpenTeamModal={onOpenTeamModal}
          />

          <AddProjectDescription
            value={formData.project_description}
            onUpdate={handleUpdate}
          />

          <AddProjectNotes
            value={formData.notes}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
}