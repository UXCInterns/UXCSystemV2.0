"use client";

import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { useUser } from "@/hooks/useUser";
import {
  ArrowUpIcon,
  ArrowDownIcon
} from "@/icons";
import { CheckCircle2Icon, ClipboardListIcon, FolderOpenIcon } from "lucide-react";

interface Project {
  id: string;
  project_name: string;
  status: string;
  progress: number;
  project_manager: { id: string };
  project_lead: { id: string };
  core_team: Array<{ id: string }>;
  support_team: Array<{ id: string }>;
}

interface Task {
  task_id: string;
  status: string;
  assignees: Array<{ id: string; name: string; email: string; avatar_url: string }> | null;
  updated_at: string;
}

interface MetricsData {
  activeProjects: number;
  projectsOver50: number;
  pendingTasks: number;
  tasksInReview: number;
  completedThisWeek: number;
  completedLastWeek: number;
}

export const UXCMetrics = () => {
  const { id: userId, loading: userLoading } = useUser();
  const [metrics, setMetrics] = useState<MetricsData>({
    activeProjects: 0,
    projectsOver50: 0,
    pendingTasks: 0,
    tasksInReview: 0,
    completedThisWeek: 0,
    completedLastWeek: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);

        // Fetch projects and tasks in parallel
        const [projectsRes, tasksRes] = await Promise.all([
          fetch('/api/projects'),
          fetch(`/api/tasks?assigned_to_id=${userId}`),
        ]);

        const projectsData = await projectsRes.json();
        const tasksData = await tasksRes.json();

        // Calculate active projects where user is assigned
        const userProjects = (projectsData.projects || []).filter(
          (project: Project) => {
            const isActive = 
              project.status === 'In Progress' || 
              project.status === 'Not Started';
            
            const isAssigned =
              project.project_manager?.id === userId ||
              project.project_lead?.id === userId ||
              project.core_team?.some((member) => member.id === userId) ||
              project.support_team?.some((member) => member.id === userId);

            return isActive && isAssigned;
          }
        );

        const activeProjects = userProjects.length;
        const projectsOver50 = userProjects.filter(
          (project: Project) => project.progress >= 50
        ).length;

        // Calculate pending tasks and tasks in review
        const userTasks = tasksData.tasks || [];
        const pendingTasks = userTasks.filter(
          (task: Task) =>
            task.status !== 'Done' && 
            task.status !== 'Cancelled'
        ).length;

        const tasksInReview = userTasks.filter(
          (task: Task) => task.status === 'Review'
        ).length;

        // Calculate tasks completed this week and last week
        const now = new Date();
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay());
        startOfThisWeek.setHours(0, 0, 0, 0);

        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

        const completedThisWeek = userTasks.filter(
          (task: Task) => {
            if (task.status !== 'Done') return false;
            const updatedDate = new Date(task.updated_at);
            return updatedDate >= startOfThisWeek;
          }
        ).length;

        const completedLastWeek = userTasks.filter(
          (task: Task) => {
            if (task.status !== 'Done') return false;
            const updatedDate = new Date(task.updated_at);
            return updatedDate >= startOfLastWeek && updatedDate < startOfThisWeek;
          }
        ).length;

        setMetrics({
          activeProjects,
          projectsOver50,
          pendingTasks,
          tasksInReview,
          completedThisWeek,
          completedLastWeek,
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchMetrics();
    }
  }, [userId]);

  // Calculate percentage change for completed tasks
  const calculatePercentageChange = () => {
    if (metrics.completedLastWeek === 0) {
      return metrics.completedThisWeek > 0 ? 100 : 0;
    }
    return Math.round(
      ((metrics.completedThisWeek - metrics.completedLastWeek) / metrics.completedLastWeek) * 100
    );
  };

  const percentageChange = calculatePercentageChange();
  const isPositiveChange = percentageChange >= 0;

  if (loading || userLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700" />
            <div className="mt-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-2/3" />
              <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {/* Active Projects */}
      <div className="group relative rounded-2xl border border-gray-200 bg-white p-5 dark:bg-white/[0.03] transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 dark:border-gray-800 dark:hover:shadow-blue-900/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110">
            <FolderOpenIcon className="text-white size-6" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Active Projects
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Assigned To Me
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h4 className="font-bold text-gray-900 text-4xl dark:text-white">
                {metrics.activeProjects}
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                projects
              </span>
            </div>
            {metrics.projectsOver50 > 0 && (
              <Badge variant="light" size="sm" color="success">
                <CheckCircle2Icon className="w-3 h-3" />
                {metrics.projectsOver50} &gt; 50%
              </Badge>
            )}
          </div>
          {metrics.activeProjects > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Progress &gt; 50%</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {Math.round((metrics.projectsOver50 / metrics.activeProjects) * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="group relative rounded-2xl border border-gray-200 bg-white p-5 dark:bg-white/[0.03] transition-all duration-300 hover:shadow-lg hover:shadow-amber-100/50 dark:border-gray-800 dark:hover:shadow-amber-900/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg shadow-amber-500/30 transition-transform duration-300 group-hover:scale-110">
            <ClipboardListIcon className="text-white size-6" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Pending Tasks
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              To Complete
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h4 className="font-bold text-gray-900 text-4xl dark:text-white">
                {metrics.pendingTasks}
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                tasks
              </span>
            </div>
            {metrics.tasksInReview > 0 && (
              <Badge variant="light" size="sm" color="warning">
                {metrics.tasksInReview} in review
              </Badge>
            )}
          </div>
          {metrics.pendingTasks >= 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">In Review</span>
                <span className={`font-semibold ${
                  metrics.tasksInReview > 3 
                    ? 'text-orange-600 dark:text-orange-400' 
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {Math.round((metrics.tasksInReview / metrics.pendingTasks) * 100) || 0}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completed This Week */}
      <div className="group relative rounded-2xl border border-gray-200 bg-white p-5 dark:bg-white/[0.03] transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100/50 dark:border-gray-800 dark:hover:shadow-emerald-900/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:scale-110">
            <CheckCircle2Icon className="text-white size-6" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Tasks Completed
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              This Week
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h4 className="font-bold text-gray-900 text-4xl dark:text-white">
                {metrics.completedThisWeek}
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                tasks
              </span>
            </div>
            {(metrics.completedThisWeek > 0 || metrics.completedLastWeek > 0) && (
              <Badge 
                variant="light" 
                size="sm" 
                color={isPositiveChange ? "success" : "error"}
              >
                {isPositiveChange ? (
                  <ArrowUpIcon className="w-3 h-3" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3" />
                )}
                {Math.abs(percentageChange)}%
              </Badge>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600 dark:text-gray-400">vs Last Week ({metrics.completedLastWeek})</span>
              <span className={`font-semibold ${
                isPositiveChange 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {isPositiveChange ? '+' : ''}{percentageChange}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};