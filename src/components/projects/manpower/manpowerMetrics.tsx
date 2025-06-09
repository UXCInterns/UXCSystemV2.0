"use client";
import React from "react";
import Badge from "../../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ShootingStarIcon,
  GroupIcon,
} from "@/icons";
import { initialData } from "../manpower/mapowerTable";

export const ManpowerMetrics = () => {
  // Compute number of members currently available
  const availableMembersCount = initialData.filter(
    (member) => member.availability === "Available"
  ).length;

  // Compute number of members who will be available in the future
  const futureAvailableCount = initialData.filter(
    (member) => member.futureAvailability === "Available"
  ).length;

  // Find the busiest members:
  // Sort by totalProjects (desc), then coreProjects (desc)
  const busiestMembers = [...initialData].sort((a, b) => {
    if (b.totalProjects !== a.totalProjects) {
      return b.totalProjects - a.totalProjects;
    }
    return b.coreProjects - a.coreProjects;
  });

  const mostBusyMemberName =
    busiestMembers.length > 0 ? busiestMembers[0].members : "N/A";
  const secondMostBusyMemberName =
    busiestMembers.length > 1 ? busiestMembers[1].members : "N/A";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 md:gap-6">
      {/* Available Members */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <div>
            <span className="text-base text-gray-500 dark:text-gray-400">
              Number of Available Members
            </span>
            <div className="mt-4 flex items-center justify-between">
              <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                {availableMembersCount}
              </h4>
              <Badge color="success">
                <ArrowUpIcon />
                {futureAvailableCount}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Busiest Member */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ShootingStarIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <div>
            <span className="text-base text-gray-500 dark:text-gray-400">
              Most Busiest Member
            </span>
            <div className="mt-4 flex items-center justify-between">
              <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                {mostBusyMemberName}
              </h4>
              <Badge color="error">{secondMostBusyMemberName}</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
