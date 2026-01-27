import React, { useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ManpowerAllocation } from "@/types/ManpowerTypes/manpower";
import { computeStatus } from "@/utils/ManpowerUtils/ManpowerTableUtils/manpowerStatus";
import { getRoles } from "@/utils/ManpowerUtils/ManpowerTableUtils/manpowerRoles";
import { getManpowerStatusBadgeProps } from "@/utils/CommonUtils/badgeUtils";
import { TableRow, TableCell } from "@/components/ui/table";
import { ManpowerProjectDetails } from "./ManpowerProjectDetails";
import { useManpowerData } from "@/hooks/ManpowerHooks/useManpowerData";

export const ManpowerTableRow = ({
  person,
}: {
  person: ManpowerAllocation;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    fetchProjects,
    projectsByProfile,
    loadingProjects,
  } = useManpowerData();

  const status = computeStatus(person);
  const roles = getRoles(person);

  const projects = projectsByProfile[person.profile_id] || [];
  const loading = loadingProjects[person.profile_id];

  const handleRowClick = () => {
    const next = !isExpanded;
    setIsExpanded(next);

    if (next) {
      fetchProjects(person.profile_id);
    }
  };

  return (
    <>
      <TableRow
        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
        onClick={handleRowClick}
      >
        {/* Name */}
        <TableCell className="px-5 py-4 text-sm text-left">
          <div className="flex items-center gap-3 min-w-0">
            {/* Expand Icon */}
            <button
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick();
              }}
            >
              {isExpanded ? (
                <ChevronDown
                  size={16}
                  className="text-blue-600 dark:text-blue-400"
                />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            <Avatar
              src={person.avatar_url}
              name={person.full_name}
              size="medium"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {person.full_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {person.email}
              </p>
            </div>
          </div>
        </TableCell>

        {/* Total Projects */}
        <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white text-center font-medium">
          {person.total_projects}
        </TableCell>

        {/* Active Projects */}
        <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white text-center font-medium">
          {person.active_projects_count}
        </TableCell>

        {/* Roles */}
        <TableCell className="px-4 py-4 text-sm text-center">
          <div className="flex flex-wrap gap-1.5 text-center justify-center">
            {roles.length > 0 ? (
              roles.map((role, idx) => (
                <Badge
                  key={idx}
                  size="sm"
                  color={role.color as any}
                  variant="light"
                >
                  {role.label} ({role.count})
                </Badge>
              ))
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No roles
              </span>
            )}
          </div>
        </TableCell>

        {/* Tasks */}
        <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white text-center font-medium">
          {person.tasks_assigned}
        </TableCell>

        {/* Status */}
        <TableCell className="px-4 py-4 text-center">
          <Badge size="sm" {...getManpowerStatusBadgeProps(status)}>
            {status}
          </Badge>
        </TableCell>
      </TableRow>

      {/* Expanded Project Details */}
      {isExpanded && (
        <ManpowerProjectDetails
          projects={projects}
          loading={loading}
        />
      )}
    </>
  );
};
