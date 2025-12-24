import React from "react";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";
import { ManpowerRecord } from "@/types/ManpowerTypes/manpower";
import { computeStatus } from "@/utils/ManpowerUtils/ManpowerTableUtils/manpowerStatus";
import { getRoles } from "@/utils/ManpowerUtils/ManpowerTableUtils/manpowerRoles";
import { getManpowerStatusBadgeProps } from "@/utils/CommonUtils/badgeUtils";
import { TableRow, TableCell } from "@/components/ui/table";

export const ManpowerTableRow = ({ person }: { person: ManpowerRecord }) => {
  const status = computeStatus(person);
  const roles = getRoles(person);

  return (
    <TableRow className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
      
      <TableCell className="px-5 py-4 text-sm text-left">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar src={person.avatar_url} name={person.full_name} size="medium" />
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

      <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white text-center font-medium">
        {person.total_projects}
      </TableCell>

      <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white text-center font-medium">
        {person.active_projects_count}
      </TableCell>

      <TableCell className="px-4 py-4 text-sm text-left">
        <div className="flex flex-wrap gap-1.5">
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

      <TableCell className="px-4 py-4 text-sm text-gray-800 dark:text-white text-center font-medium">
        {person.tasks_assigned}
      </TableCell>

      <TableCell className="px-4 py-4 text-center">
        <Badge size="sm" {...getManpowerStatusBadgeProps(status)}>
          {status}
        </Badge>
      </TableCell>

    </TableRow>
  );
};
