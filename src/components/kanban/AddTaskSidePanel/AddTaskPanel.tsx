"use client";

import React, { useState } from "react";
import { Profile } from "@/types/ProjectsTypes/project";
import AssigneesModal from '../TaskDetailsSidePanel/AssigneesModal';
import TaskPanelHeader from './AddTaskPanelHeader';
import TaskFormFields from './AddTaskFormFields';
import TaskAssigneesSection from './AddTaskAssigneesSection';
import TaskNotesSections from './AddTaskNotesSections';
import { useTaskSubmission } from '@/hooks/KanbanBoardHooks/KanbanBoard/useTaskSubmission';

interface AddTaskPanelProps {
  projectId: string;
  projectName: string;
  profiles: Profile[];
  projectMembers?: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTaskPanel({ 
  projectId,
  projectName,
  profiles, 
  projectMembers,
  onClose, 
  onSuccess
}: AddTaskPanelProps) {
  const [formData, setFormData] = useState({
    task_name: "",
    task_description: "",
    priority: "Medium" as "Low" | "Medium" | "High" | "Critical",
    started_at: "",
    due_date: "",
    comments: "",
  });
  
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showAssigneesModal, setShowAssigneesModal] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const { loading, error, submitTask } = useTaskSubmission({
    projectId,
    onSuccess,
    onClose
  });

  // Get assignee details
  const assignees = profiles.filter(p => selectedAssignees.includes(p.id));

  const handleSubmit = () => {
    submitTask(formData, selectedAssignees);
  };

  const handleUpdate = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleAssignee = (profileId: string) => {
    setSelectedAssignees(prev => 
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSaveAssignees = () => {
    setShowAssigneesModal(false);
  };

  return (
    <>
      <div className="w-[390px] flex-shrink-0 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl h-full flex flex-col">
        {/* Header */}
        <TaskPanelHeader
          title="New Task"
          onSave={handleSubmit}
          onClose={onClose}
          loading={loading}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <TaskFormFields
              formData={formData}
              projectName={projectName}
              onUpdate={handleUpdate}
              showDropdown={showDropdown}
              onDropdownChange={setShowDropdown}
            />

            <TaskAssigneesSection
              assignees={assignees}
              onManageClick={() => setShowAssigneesModal(true)}
            />

            <TaskNotesSections
              description={formData.task_description}
              comments={formData.comments}
              onDescriptionChange={(value) => handleUpdate('task_description', value)}
              onCommentsChange={(value) => handleUpdate('comments', value)}
            />
          </div>
        </div>
      </div>

      {/* Assignees Modal */}
      {showAssigneesModal && (
        <AssigneesModal
          profiles={profiles}
          selectedAssignees={selectedAssignees}
          projectMembers={projectMembers}
          onToggle={handleToggleAssignee}
          onSave={handleSaveAssignees}
          onClose={() => setShowAssigneesModal(false)}
        />
      )}
    </>
  );
}