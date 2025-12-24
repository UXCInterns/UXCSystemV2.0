"use client";

import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { useUser } from "@/hooks/useUser";
import {
  AlertCircleIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  FolderKanbanIcon,
  PauseCircleIcon,
  TrendingUpIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import Toggle from "../ui/toggle/Toggle";

// Toggle Component
interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleProps<T extends string> {
  options: ToggleOption[];
  selectedValue: T;
  onChange: (value: T) => void;
  className?: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface Project {
  id: string;
  project_name: string;
  project_description: string;
  status: string;
  progress: number;
  start_date: string;
  end_date: string;
  project_manager: TeamMember;
  project_lead: TeamMember;
  core_team: TeamMember[];
  support_team: TeamMember[];
}

type FilterType = "all" | "on-track" | "at-risk" | "behind";

export const ProjectsGrid = () => {
  const { id: userId, loading: userLoading } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>("all");
  
  const PROJECT_STATUS_ORDER: Record<string, number> = {
    'Not Started': 1,
    'In Progress': 2,
    'On Hold': 3,
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        const data = await response.json();

        const userProjects = (data.projects || [])
          .filter((project: Project) => (
            project.project_manager?.id === userId ||
            project.project_lead?.id === userId ||
            project.core_team?.some((member) => member.id === userId) ||
            project.support_team?.some((member) => member.id === userId)
          ))
          // remove completed projects (optional)
          .filter((project: Project) => project.status !== 'Completed')
          // sort by status order
          .sort((a: Project, b: Project) => {
            const orderA = PROJECT_STATUS_ORDER[a.status] ?? 999;
            const orderB = PROJECT_STATUS_ORDER[b.status] ?? 999;
            return orderA - orderB;
          });

        setProjects(userProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProjects();
    }
  }, [userId]);

  const getUserRole = (project: Project): string[] => {
    const roles: string[] = [];
    if (project.project_manager?.id === userId) roles.push('Manager');
    if (project.project_lead?.id === userId) roles.push('Lead');
    if (project.core_team?.some((member) => member.id === userId)) roles.push('Core');
    if (project.support_team?.some((member) => member.id === userId)) roles.push('Support');
    return roles;
  };

  const getStatusConfig = (status: string) => {
    type BadgeColor = "success" | "error" | "warning" | "info" | "primary" | "purple";
    
    const configs: Record<string, { icon: React.ReactElement; badgeColor: BadgeColor }> = {
      'In Progress': {
        icon: <TrendingUpIcon className="w-3.5 h-3.5" />,
        badgeColor: 'primary',
      },
      'Not Started': {
        icon: <ClockIcon className="w-3.5 h-3.5" />,
        badgeColor: 'light' as BadgeColor,
      },
      'Completed': {
        icon: <CheckCircle2Icon className="w-3.5 h-3.5" />,
        badgeColor: 'success',
      },
      'On Hold': {
        icon: <PauseCircleIcon className="w-3.5 h-3.5" />,
        badgeColor: 'warning',
      },
      'Cancelled': {
        icon: <XCircleIcon className="w-3.5 h-3.5" />,
        badgeColor: 'error',
      },
    };
    return configs[status] || configs['Not Started'];
  };

  const getRoleBadgeColor = (role: string): "success" | "error" | "warning" | "info" | "primary" | "purple" => {
    const colors: Record<string, "success" | "error" | "warning" | "info" | "primary" | "purple"> = {
      'Manager': 'error',
      'Lead': 'warning',
      'Core': 'info',
      'Support': 'success',
    };
    return colors[role] || 'info';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-emerald-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-400';
  };

  // Get unique team members (no duplicates)
  const getUniqueTeamMembers = (project: Project): TeamMember[] => {
    const allMembers: TeamMember[] = [];
    const seenIds = new Set<string>();

    const addMember = (member: TeamMember | null | undefined) => {
      if (member && member.id && !seenIds.has(member.id)) {
        seenIds.add(member.id);
        allMembers.push(member);
      }
    };

    // Add in order: manager, lead, core team, support team
    addMember(project.project_manager);
    addMember(project.project_lead);
    project.core_team?.forEach(addMember);
    project.support_team?.forEach(addMember);

    return allMembers;
  };

  const calculateTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let timeText = '';
    let badgeColor: "success" | "error" | "warning" | "info" = 'info';
    
    if (diffDays < 0) {
      timeText = 'Overdue';
      badgeColor = 'error';
    } else if (diffDays === 0) {
      timeText = 'Due Today';
      badgeColor = 'error';
    } else if (diffDays === 1) {
      timeText = '1 day';
      badgeColor = 'warning';
    } else if (diffDays < 7) {
      timeText = `${diffDays} days`;
      badgeColor = 'warning';
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      timeText = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      badgeColor = 'info';
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      timeText = `${months} ${months === 1 ? 'month' : 'months'}`;
      badgeColor = 'success';
    } else {
      const years = Math.floor(diffDays / 365);
      timeText = `${years} ${years === 1 ? 'year' : 'years'}`;
      badgeColor = 'success';
    }
    
    return { timeText, badgeColor, diffDays };
  };

  // Project health classification
  const getProjectHealth = (project: Project): "on-track" | "at-risk" | "behind" => {
    const { diffDays } = calculateTimeRemaining(project.end_date);
    
    // Behind schedule: overdue or due within 3 days with low progress
    if (diffDays < 0 || (diffDays <= 3 && project.progress < 90)) {
      return "behind";
    }
    
    // At risk: progress significantly behind expected timeline or on hold
    const now = new Date();
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    const expectedProgress = (elapsed / totalDuration) * 100;
    
    if (project.status === "On Hold" || 
        (project.progress < expectedProgress - 20 && diffDays < 30)) {
      return "at-risk";
    }
    
    // On track: everything else
    return "on-track";
  };

  // Filter projects based on selected filter
  const filteredProjects = projects.filter((project) => {
    if (filterType === "all") return true;
    const health = getProjectHealth(project);
    return health === filterType;
  });

  const filterOptions: ToggleOption[] = [
    { value: "all", label: "All Projects" },
    { value: "on-track", label: "On Track" },
    { value: "at-risk", label: "At Risk" },
    { value: "behind", label: "Behind Schedule" }
  ];

  if (loading || userLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        {/* Header Skeleton */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-32 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-56 animate-pulse" />
            </div>
            <div className="h-7 bg-gray-200 rounded-full dark:bg-gray-700 w-24 animate-pulse" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-white/[0.02] animate-pulse"
              >
                <div className="h-5 bg-gray-200 rounded dark:bg-gray-700 w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Projects
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Projects you are currently involved in
              </p>
            </div>
            <Badge variant="light" size="sm" color="info">
              0 Projects
            </Badge>
          </div>
        </div>

        {/* Empty State */}
        <div className="p-12">
          <div className="text-center">
            <AlertCircleIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              No Projects Found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You are not assigned to any projects yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30 transition-transform duration-300 group-hover:scale-110">
              <FolderKanbanIcon className="text-white size-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Projects
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Projects you are currently involved in
              </p>
            </div>
          </div>
          <Badge variant="light" size="sm" color="purple">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
          </Badge>
        </div>
        
        {/* Filter Toggle */}
        <Toggle
          options={filterOptions}
          selectedValue={filterType}
          onChange={setFilterType}
          className="w-full"
        />
      </div>
      
      {/* Projects Grid */}
      <div className="p-5">
        {filteredProjects.length === 0 ? (
          <div className="py-12 text-center">
            <AlertCircleIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              No Projects Found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No projects match the selected filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {filteredProjects.map((project) => {
              const roles = getUserRole(project);
              const statusConfig = getStatusConfig(project.status);
              const uniqueTeamMembers = getUniqueTeamMembers(project);
              const totalTeamSize = uniqueTeamMembers.length;
              const { timeText, badgeColor: timeColor } = calculateTimeRemaining(project.end_date);

              return (
                <div
                  key={project.id}
                  className="group relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-purple-50/30 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50 dark:border-gray-800 dark:from-white/[0.03] dark:to-purple-900/[0.05] dark:hover:shadow-purple-900/20"
                >
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {project.project_name}
                      </h3>
                    </div>

                    {/* Role Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {roles.map((role) => (
                        <Badge
                          key={role}
                          variant="light"
                          size="sm"
                          color={getRoleBadgeColor(role)}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Progress
                      </span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                          project.progress
                        )}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    {/* Time Remaining Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </span>
                      <Badge 
                        variant="light" 
                        size="sm" 
                        color={statusConfig.badgeColor}
                        startIcon={statusConfig.icon}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Time Left
                      </span>
                      <Badge 
                        variant="light" 
                        size="sm" 
                        color={timeColor}
                        startIcon={<ClockIcon className="w-3 h-3" />}
                      >
                        {timeText}
                      </Badge>
                    </div>

                    {/* Team Avatars */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Team
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2">
                          {uniqueTeamMembers.slice(0, 3).map((member) => (
                            <img
                              key={member.id}
                              src={member.avatar_url || '/images/user/default-avatar.jpg'}
                              alt={member.name}
                              className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 object-cover hover:z-10 transition-transform hover:scale-110 cursor-pointer"
                              title={member.name}
                            />
                          ))}
                          {totalTeamSize > 3 && (
                            <div 
                              className="w-7 h-7 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                              title={`${totalTeamSize - 3} more members`}
                            >
                              +{totalTeamSize - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/[0.02] group-hover:to-purple-500/[0.02] transition-all duration-300 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};