import React from "react";
import { ManpowerRecord, StatusFilter } from "@/types/ManpowerTypes/manpower";
import { ManpowerTableRow } from "./ManpowerTableRow";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";

export const ManpowerTableBody = ({
  loading,
  paginatedManpower,
  statusFilter
}: {
  loading: boolean;
  paginatedManpower: ManpowerRecord[];
  statusFilter: StatusFilter;
}) => {
  if (loading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={6}
            className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Loading manpower data...
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (paginatedManpower.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={6}
            className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
          >
            {statusFilter !== "All"
              ? "No people match your filter."
              : "No manpower data found."}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
      {paginatedManpower.map((person) => (
        <ManpowerTableRow key={person.profile_id} person={person} />
      ))}
    </TableBody>
  );
};
