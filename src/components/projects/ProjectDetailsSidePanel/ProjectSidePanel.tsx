import { X, Edit2, Trash2, Check } from "lucide-react";
import { Project, Profile } from "@/types/ProjectsTypes/project";
import ProjectDetailsForm from "./ProjectDetailsForm";
import { BadgeColor, BadgeVariant } from "@/components/ui/badge/Badge";

interface Props {
  project: Project;
  isEditing: boolean;
  profiles: Profile[];
  showDropdown: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  onClose: () => void;
  onUpdate: (updates: Partial<Project>) => void;
  onDropdownToggle: (key: string | null) => void;
  onUpdateManager: (id: string, role: 'manager' | 'lead') => void;
  onOpenTeamModal: (type: 'core' | 'support') => void;
  getStatusBadgeProps: (status: string) => {
    color?: BadgeColor;
    variant?: BadgeVariant;
  };
}

export default function ProjectSidePanel({
  project,
  isEditing,
  profiles,
  showDropdown,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onClose,
  onUpdate,
  onDropdownToggle,
  onUpdateManager,
  onOpenTeamModal,
  getStatusBadgeProps,
}: Props) {

  return (
    <div className="w-[420px] flex-shrink-0 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/[0.05] flex items-center justify-between">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white/90">
          {project.project_name}
        </h3>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="p-1.5 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                title="Save"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={onCancel}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  window.location.href = `/project-board/${project.id}/kanban`
                }}
                className="p-1.5 text-warning-600 hover:text-warning-700 dark:text-warning-400 dark:hover:text-warning-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                  />
                </svg>
              </button>
              <button
                onClick={onEdit}
                className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="space-y-4">
          {/* Details Form with Team Section */}
          <ProjectDetailsForm
            project={project}
            isEditing={isEditing}
            profiles={profiles}
            showDropdown={showDropdown}
            onUpdate={onUpdate}
            onDropdownToggle={onDropdownToggle}
            onUpdateManager={onUpdateManager}
            onOpenTeamModal={onOpenTeamModal}
            getStatusBadgeProps={getStatusBadgeProps}
          />
        </div>
      </div>
    </div>
  );
}