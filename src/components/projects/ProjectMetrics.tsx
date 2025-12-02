"use client";

import React, { useState, useEffect } from "react";
import { onProjectUpdate } from "@/lib/projectEvents";

type Project = {
  id: string;
  project_name: string;
  project_description: string;
  project_manager: { name: string; email: string };
  project_lead: { name: string; email: string };
  core_team: string[];
  support_team: string[];
  start_date: string;
  end_date: string;
  progress: number;
  status: string;
  notes: string;
};

export const ProjectMetrics = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    
    // Listen for project updates
    const unsubscribe = onProjectUpdate(() => {
      fetchProjects();
    });

    return unsubscribe;
  }, []);

  const totalProjects = projects.length;

  // Count by status
  const statusCounts = {
    inProgress: projects.filter(p => p.status === "In Progress").length,
    pending: projects.filter(p => p.status === "Pending" || p.status === "Not Started").length,
    completed: projects.filter(p => p.status === "Completed").length,
  };

  const currentProjects = statusCounts.inProgress;
  const futureProjects = statusCounts.pending;
  const completedProjects = statusCounts.completed;

  // Calculate projects due next month
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const startOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  const endOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

  const projectsDueNextMonth = projects.filter((project: Project) => {
    // Handle different date formats
    if (project.end_date === 'Ongoing' || project.end_date === 'Not set') {
      return false;
    }
    
    try {
      const endDate = new Date(project.end_date);
      return endDate >= startOfNextMonth && endDate <= endOfNextMonth;
    } catch {
      return false;
    }
  }).length;

  // Calculate average progress
  const avgProgress =
    totalProjects > 0
      ? (
          projects.reduce((sum: number, p: Project) => sum + p.progress, 0) /
          totalProjects
        ).toFixed(0)
      : 0;

  // Show loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse"
          >
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="mt-3 flex items-end justify-between">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* Total Projects */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total Projects
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {totalProjects}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
              {currentProjects} active
            </span>
          </div>
        </div>
      </div>

      {/* Completed Projects */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Completed Projects
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {completedProjects}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
              {totalProjects > 0
                ? ((completedProjects / totalProjects) * 100).toFixed(0)
                : 0}
              %
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              completion rate
            </span>
          </div>
        </div>
      </div>

      {/* Average Progress */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Average Progress
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {avgProgress}%
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-500/15 dark:text-purple-500">
              {currentProjects} in progress
            </span>
          </div>
        </div>
      </div>

      {/* Due Next Month */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Due Next Month
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {projectsDueNextMonth}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                projectsDueNextMonth > 3
                  ? "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-500"
                  : "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500"
              }`}
            >
              {projectsDueNextMonth > 3 ? "High priority" : "On track"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};