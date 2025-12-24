"use client";

import React, { useState, useEffect } from "react";
import { onProjectUpdate } from "@/lib/projectEvents";
import { MetricStatCard } from "@/components/ui/metric/MetricStatCard";
import { Project } from "@/types/ProjectsTypes/project";

export const ProjectMetrics = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    return onProjectUpdate(fetchProjects);
  }, []);

  const totalProjects = projects.length;

  const statusCounts = {
    inProgress: projects.filter(p => p.status === "In Progress").length,
    pending: projects.filter(p => ["Pending", "Not Started"].includes(p.status)).length,
    completed: projects.filter(p => p.status === "Completed").length,
  };

  const currentProjects = statusCounts.inProgress;
  const completedProjects = statusCounts.completed;

  // Due next month
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const startOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  const endOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

  const projectsDueNextMonth = projects.filter(project => {
    if (["Ongoing", "Not set"].includes(project.end_date)) return false;
    const endDate = new Date(project.end_date);
    return endDate >= startOfNextMonth && endDate <= endOfNextMonth;
  }).length;

  const avgProgress =
    totalProjects > 0
      ? (projects.reduce((s, p) => s + p.progress, 0) / totalProjects).toFixed(0)
      : 0;

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

      <MetricStatCard
        label="Total Projects"
        value={totalProjects}
        badgeText={`${currentProjects} active`}
        badgeColor="blue"
      />

      <MetricStatCard
        label="Completed Projects"
        value={completedProjects}
        badgeText={
          totalProjects > 0
            ? ((completedProjects / totalProjects) * 100).toFixed(0) + "%"
            : "0%"
        }
        helperText="completion rate"
        badgeColor="green"
      />

      <MetricStatCard
        label="Average Progress"
        value={`${avgProgress}%`}
        badgeText={`${currentProjects} in progress`}
        badgeColor="purple"
      />

      <MetricStatCard
        label="Due Next Month"
        value={projectsDueNextMonth}
        badgeText={
          projectsDueNextMonth > 3 ? "High priority" : "On track"
        }
        badgeColor={projectsDueNextMonth > 3 ? "orange" : "green"}
      />

    </div>
  );
};
