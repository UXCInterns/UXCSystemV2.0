"use client";
import React from "react";
import {
  ShootingStarIcon,
  BoltIcon,
  BoxCubeIcon,
  AlertIcon
  
} from "@/icons";

interface ProjectMetricsProps {
  currentProjectsCount: number;
  futureProjectsCount: number;
  totalProjectsCount: number;
  dueNextMonthCount: number;
}

export const ProjectMetrics: React.FC<ProjectMetricsProps> = ({
  currentProjectsCount,
  futureProjectsCount,
  totalProjectsCount,
  dueNextMonthCount,

}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 md:gap-4">
      {[
        {
          icon: <BoltIcon className="text-gray-800 size-6 dark:text-white/90" />,
          label: "Current Projects",
          value: currentProjectsCount.toLocaleString(),
        },
        {
          icon: <AlertIcon className="text-gray-800 dark:text-white/90" />,
          label: "Future Projects",
          value: futureProjectsCount.toLocaleString(),
        },
        {
          icon: <BoxCubeIcon className="text-gray-800 size-6 dark:text-white/90" />,
          label: "Total Projects",
          value: totalProjectsCount.toLocaleString(),
        },
        {
          icon: <ShootingStarIcon className="text-gray-800 dark:text-white/90" />,
          label: "Due Next Month",
          value: dueNextMonthCount.toLocaleString(),
        },
      ].map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-start text-center rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl dark:bg-gray-800">
              {item.icon}
            </div>
            <span className="text-base text-gray-500 dark:text-gray-400">
              {item.label}
            </span>
          </div>
          <h4 className="mt-10 ml-2 text-3xl font-bold text-gray-800 dark:text-white/90">{item.value}</h4>
        </div>
      ))}
    </div>
  );
};
