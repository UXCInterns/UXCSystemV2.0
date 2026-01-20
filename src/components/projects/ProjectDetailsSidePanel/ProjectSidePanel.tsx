import { X, Edit2, Trash2, Check } from "lucide-react";
import { Project, Profile } from "@/types/ProjectsTypes/project";
import ProjectDetailsForm from "./ProjectDetailsForm";

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
  getStatusBadgeProps: (status: string) => any;
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
    <>
      {/* Mobile Full-Screen Modal */}
      <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="absolute inset-0 flex items-end">
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl max-h-[90vh] flex flex-col animate-slideUp shadow-2xl">
            {/* Mobile Header */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-white/[0.05] bg-white dark:bg-gray-900 rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 truncate pr-2">
                  {project.project_name}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={onSave}
                    className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={onCancel}
                    className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      window.location.href = `/project-board/${project.id}/kanban`
                    }}
                    className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      />
                    </svg>
                    Board
                  </button>
                  <button
                    onClick={onEdit}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={onDelete}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
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
        </div>
      </div>

      {/* Desktop Side Panel - Hidden on mobile */}
      <div className="hidden md:block w-[420px] flex-shrink-0 bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05] rounded-xl h-full">
        <div className="flex flex-col h-full">
          {/* Desktop Header */}
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

          {/* Desktop Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-4">
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