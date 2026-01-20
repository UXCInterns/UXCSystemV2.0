"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { Profile } from "@/types/ProjectsTypes/project";
import AddProjectBasicInfo from "./AddProjectBasicInfo";
import AddProjectDates from "./AddProjectDates";
import AddProjectTeam from "./AddProjectTeam";
import AddProjectDescription from "./AddProjectDescription";
import AddProjectNotes from "./AddProjectNotes";
import { supabase } from "../../../../lib/supabase/supabaseClient";

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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to create projects');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          project_manager_id: formData.project_manager_id || null,
          project_lead_id: formData.project_lead_id || null,
          _current_user_id: user.id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create project');
      }

      const result = await response.json();
      const projectId = result.project.id;

      for (const profileId of coreTeamMembers) {
        await fetch(`/api/projects/${projectId}/team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            profile_id: profileId, 
            team_type: 'core',
            _current_user_id: user.id
          }),
        });
      }

      for (const profileId of supportTeamMembers) {
        await fetch(`/api/projects/${projectId}/team`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            profile_id: profileId, 
            team_type: 'support',
            _current_user_id: user.id
          }),
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
    <>
      {/* Mobile Overlay - Full Screen Modal */}
      <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="absolute inset-0 flex items-end">
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl max-h-[90vh] flex flex-col animate-slideUp shadow-2xl">
            {/* Mobile Header */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-white/[0.05] flex items-center justify-between bg-white dark:bg-gray-900 rounded-t-3xl sticky top-0 z-10">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                New Project
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4">
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
        </div>
      </div>

      {/* Desktop Side Panel - Hidden on mobile */}
      <div className="hidden md:block w-[420px] flex-shrink-0 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl h-full">
        <div className="flex flex-col h-full">
          {/* Desktop Header */}
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

          {/* Desktop Content */}
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
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}