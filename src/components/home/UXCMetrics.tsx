"use client";

import React from "react";
import Badge from "../ui/badge/Badge";
import { projectData } from "./ProjectTable";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  GridIcon,
  UserCogIcon,
  ListToDoIcon,
} from "@/icons";

export const UXCMetrics = () => {
  const coreRoles = ["Manager", "Lead", "Core"];

  const coreProjects = projectData.filter((project) =>
    project.roles.some((role) => coreRoles.includes(role))
  );

  const supportProjects = projectData.filter(
    (project) =>
      !project.roles.some((role) => coreRoles.includes(role)) &&
      project.roles.includes("Support")
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {/* Core Projects */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GridIcon className="text-gray-800 size-6 dark:text-white/90 rotate-45" />
        </div>

        <div className="mt-5 space-y-2">
          <span className="text-base text-gray-500 dark:text-gray-400">
            Core Projects
          </span>
          <div className="mt-6 flex justify-between items-center">
            {/* Number on the left */}
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              {coreProjects.length}
            </h4>

            {/* Badge and text grouped on the right */}
            <div className="flex items-center gap-2">
              <Badge color="success">
                <ArrowUpIcon />2
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">Next Month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Support Projects */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <UserCogIcon className="text-gray-800 dark:text-white/90" />
        </div>

        <div className="mt-5 space-y-2">
          <span className="text-base text-gray-500 dark:text-gray-400">
            Support Projects
          </span>
          <div className="mt-6 flex justify-between items-center">
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              {supportProjects.length}
            </h4>
            <div className="flex items-center gap-2">
              <Badge color="error">
                <ArrowDownIcon className="text-error-500" />1
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">Next Month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks To Complete */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ListToDoIcon className="text-gray-800 dark:text-white/90" />
        </div>

        <div className="mt-5 space-y-2">
          <span className="text-base text-gray-500 dark:text-gray-400">
            Tasks To Complete
          </span>
          <div className="mt-6 flex justify-between items-center">
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              5
            </h4>
            <div className="flex items-center gap-2">
              <Badge color="error">
                <ArrowDownIcon className="text-error-500" />3
              </Badge>
              <span className="text-sm text-gray-500 dark:text-gray-400">Next Month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
