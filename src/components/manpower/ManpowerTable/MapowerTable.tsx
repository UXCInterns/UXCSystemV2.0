// Main manpower allocation table component
// Displays team members with their project involvement, roles, and workload status
// Features: real-time updates, status filtering, and pagination
"use client";

import React from "react";
import Pagination from "@/components/common/Pagination";
import { useManpowerWithRealtime } from "@/hooks/ManpowerHooks/useManpowerWithRealtime";
import { useManpowerFilters } from "@/hooks/ManpowerHooks/useManpowerFilters";
import { ManpowerTableHeader } from "./ManpowerTableHeader";
import { ResultsCount } from "./ResultsCount";
import { ManpowerTableBody } from "./ManpowerTableBody";
import { Table, TableHeader, TableRow, TableCell } from "@/components/ui/table";

export default function ManpowerTable() {
  const { manpower, loading, error } = useManpowerWithRealtime();
  const {
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    filteredManpower,
    paginatedManpower,
    totalPages,
  } = useManpowerFilters({ manpower, pageSize: 10 });

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      <div className="w-full">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] h-full flex flex-col">
          <div className="max-w-full overflow-x-auto flex-1 flex flex-col">
            {/* Header */}
            <ManpowerTableHeader
              statusFilter={statusFilter}
              onFilterChange={setStatusFilter}
            />

            {/* Results Count */}
            <ResultsCount
              loading={loading}
              error={error}
              currentCount={paginatedManpower.length}
              totalCount={filteredManpower.length}
            />

            {/* Table */}
            <div className="min-w-full flex-1 overflow-auto custom-scrollbar">
              <Table className="w-full">
                
                <TableHeader className="sticky top-0 border-b border-gray-100 dark:border-white/[0.05] bg-gray-200 dark:bg-gray-900">
                  <TableRow>
                    <TableCell isHeader className="w-[15%] px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Person
                    </TableCell>
                    <TableCell isHeader className="w-[15%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Projects
                    </TableCell>
                    <TableCell isHeader className="w-[15%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Active Projects
                    </TableCell>
                    <TableCell isHeader className="w-[25%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Roles
                    </TableCell>
                    <TableCell isHeader className="w-[15%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tasks Assigned
                    </TableCell>
                    <TableCell isHeader className="w-[15%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <ManpowerTableBody
                  loading={loading}
                  paginatedManpower={paginatedManpower}
                  statusFilter={statusFilter}
                />

              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-auto border-t border-gray-200 dark:border-white/[0.05]">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}