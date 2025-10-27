"use client";

import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { useProjectData, } from "@/hooks/project/useProjectData";
import { Project } from "@/types/project";
import { projectData } from "@/components/home/ProjectTable";

export const ProjectMetrics = () => {
  const {projects,totalProjects ,statusCounts } = useProjectData();

  // // Current Projects (only In Progress)
  const currentProjects = statusCounts.inProgress;

  // // Future Projects (only Pending)
  const futureProjects = statusCounts.pending;

  // Calculate projects due next month
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const startOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  const endOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

const projectsDueNextMonth = projects.filter((project: Project) => {
  const endDate = new Date(project.end_date);
  return endDate >= startOfNextMonth && endDate <= endOfNextMonth;
}).length;

  // Percentage changes (mock/demo)
  const currentProjectsChange = ((currentProjects / totalProjects) * 100).toFixed(1);
  const futureProjectsChange = ((futureProjects / totalProjects) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Current Projects */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        {/* Icon + Title inline */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg dark:bg-blue-800/20">
            <GroupIcon className="text-blue-600 size-6 dark:text-blue-400" />
          </div>
          <span className="text-md font-medium text-gray-600 dark:text-gray-400">
            Current Projects 
          </span>
        </div>

        {/* Numbers stacked */}
        <div className="flex items-end justify-between mt-4">
          <div>
            <h4 className="font-bold text-gray-800 text-3xl dark:text-white/90">
              {currentProjects}
            </h4>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              In Progress
            </span>
          </div>
          <Badge color="info" size="sm">
            <ArrowUpIcon />
            {currentProjectsChange}%
          </Badge>
        </div>
      </div>

      {/* Future Projects */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg dark:bg-purple-800/20">
            <BoxIconLine className="text-purple-600 size-6 dark:text-purple-400" />
          </div>
          <span className="text-md font-medium text-gray-600 dark:text-gray-400">
            Future Projects 
          </span>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div>
            <h4 className="font-bold text-gray-800 text-3xl dark:text-white/90">
              {futureProjects}
            </h4>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              Pending
            </span>
          </div>
          <Badge color="warning" size="sm">
            <ArrowUpIcon />
            {futureProjectsChange}%
          </Badge>
        </div>
      </div>

      {/* Total Projects */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg dark:bg-green-800/20">
            <GroupIcon className="text-green-600 size-6 dark:text-green-400" />
          </div>
          <span className="text-md font-medium text-gray-600 dark:text-gray-400">
            Total Projects
          </span>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div>
            {/* <h4 className="font-bold text-gray-800 text-3xl dark:text-white/90">
              {totalProjects}
            </h4> */}
            <span className="text-sm text-gray-400 dark:text-gray-500">
              All time
            </span>
          </div>
          <Badge color="success" size="sm">
            <ArrowUpIcon />
            100% hard coded bruh
          </Badge>
        </div>
      </div>

      {/* Projects Due Next Month */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg dark:bg-orange-800/20">
            <BoxIconLine className="text-orange-600 size-6 dark:text-orange-400" />
          </div>
          <span className="text-md font-medium text-gray-600 dark:text-gray-400">
            Due Next Month
          </span>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div>
            <h4 className="font-bold text-gray-800 text-3xl dark:text-white/90">
              {projectsDueNextMonth}
            </h4>
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {new Date(startOfNextMonth).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <Badge color={projectsDueNextMonth > 3 ? "error" : "success"} size="sm">
            {projectsDueNextMonth > 3 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {projectsDueNextMonth > 0 ? `${projectsDueNextMonth}` : "0"} due
          </Badge>
        </div>
      </div>
    </div>
  );
};
