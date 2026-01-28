import React from 'react';
import Badge from '@/components/ui/badge/Badge';
import { getStatusBadgeProps } from '@/utils/CommonUtils/badgeUtils';
import { normalizeRole, getRoleBadgeColor } from "@/utils/ManpowerUtils/ManpowerTableUtils/manpowerRoles";

interface Project {
  project_id: string;
  project_name: string;
  project_status: string;
  roles: string[];
  tasks_assigned: number;
  start_date: string;
  end_date: string | null;
}

interface ManpowerProjectDetailsProps {
  projects: Project[];
  loading: boolean;
}

export const ManpowerProjectDetails: React.FC<ManpowerProjectDetailsProps> = ({ 
  projects, 
  loading 
}) => {
  if (loading) {
    return (
      <tr>
        <td colSpan={6} className="px-5 py-8 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">Loading projects...</span>
          </div>
        </td>
      </tr>
    );
  }

  if (projects.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-5 py-8 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No projects found for this person
          </p>
        </td>
      </tr>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return null;
    }
  };

  return (
    <tr>
      <td colSpan={6} className="px-0 py-0">
        <div className="bg-gray-50 dark:bg-gray-800/30 border-t border-gray-200 dark:border-gray-700">
          <div className="px-5 py-4">
            
            <div className="space-y-2">
              {projects.map((project) => (
                <div
                  key={project.project_id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 hover:shadow-sm transition-shadow"
                >
                  <div className="gap-2 items-center flex flex-row">
                    {/* Project Name and Dates */}
                    <div className="w-[60%]">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.project_name}
                      </p>
                      {(project.start_date || project.end_date) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(project.start_date)}
                          {project.end_date && ` - ${formatDate(project.end_date)}`}
                          {!project.end_date && project.start_date && ' - Ongoing'}
                        </p>
                      )}
                    </div>

                    {/* Roles - Now displaying multiple badges */}
                    <div className="w-[30%]">
                        <div className="flex flex-row gap-1 text-center justify-center">
                        {project.roles?.length ? (
                            project.roles.map((role, index) => {
                            const normalized = normalizeRole(role);
                            const badgeColor = getRoleBadgeColor(normalized) as 'error' | 'warning' | 'primary' | 'success' | 'gray';

                            return (
                                <Badge
                                key={`${project.project_id}-${normalized}-${index}`}
                                size="sm"
                                color={badgeColor}
                                variant="light"
                                >
                                {normalized}
                                </Badge>
                            );
                            })
                        ) : (
                            <Badge size="sm" color="gray" variant="light">
                            No role
                            </Badge>
                        )}
                        </div>
                    </div>

                    {/* Tasks Assigned */}
                    <div className="w-[15%] text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {project.tasks_assigned === 0 && 'No tasks'}
                          {project.tasks_assigned === 1 && '1 task'}
                          {project.tasks_assigned > 1 && `${project.tasks_assigned} tasks`}
                        </span>
                      </div>
                    </div>

                    {/* Project Status */}
                    <div className="w-[15%] text-right">
                      <Badge size="sm" {...getStatusBadgeProps(project.project_status)}>
                        {project.project_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};