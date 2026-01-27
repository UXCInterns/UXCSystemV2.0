import React from "react";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ManpowerTableRow } from "./ManpowerTableRow";
import { ManpowerRecord } from "@/types/ManpowerTypes/manpower";

interface ManpowerTableBodyProps {
  loading: boolean;
  paginatedManpower: ManpowerRecord[];
  statusFilter: string;
}

export const ManpowerTableBody: React.FC<ManpowerTableBodyProps> = ({
  loading,
  paginatedManpower,
  statusFilter,
}) => {
  // Loading state
  if (loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading manpower data...
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  // Empty state
  if (paginatedManpower.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="px-6 py-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <svg
                className="w-12 h-12 text-gray-300 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                No team members found
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {statusFilter !== "All"
                  ? `Try changing the status filter to see more results`
                  : `There are no team members in the system yet`}
              </p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  // Data rows with expandable project details
  return (
    <TableBody>
      {paginatedManpower.map((person) => (
        <ManpowerTableRow key={person.profile_id} person={person} />
      ))}
    </TableBody>
  );
};