import React from "react";
import Pagination from "@/components/common/Pagination";
import { Project } from "@/types/project";
import ProjectTableRow from "./ProjectTableRow";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import SearchQuery from "@/components/common/SearchQuery";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table/index";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  loading: boolean;
  error: string | null;
  paginatedProjects: Project[];
  filteredProjects: Project[];
  currentPage: number;
  totalPages: number;
  showSidePanel: boolean;
  onPageChange: (page: number) => void;
  onNewProject: () => void;
  onSelectProject: (project: Project) => void;
  getStatusBadgeProps: (status: string) => any;
}

export default function ProjectsTableView({
  searchQuery,
  onSearchChange,
  loading,
  error,
  paginatedProjects,
  filteredProjects,
  currentPage,
  totalPages,
  showSidePanel,
  onPageChange,
  onNewProject,
  onSelectProject,
  getStatusBadgeProps
}: Props) {
  return (
    <div className={`transition-all duration-300 ${showSidePanel ? 'w-[calc(100%-444px)]' : 'w-full'}`}>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] h-full flex flex-col">
        <div className="max-w-full overflow-x-auto flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-white/[0.05]">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Projects Table
            </h4>
            <div className="flex items-center gap-3">
              <SearchQuery value={searchQuery} onChange={onSearchChange} />
              <Button
                onClick={onNewProject}
                variant="primary"
                size="sm"
                startIcon={<PlusIcon />}
                className="py-3"
              >
                New Project
              </Button>
            </div>
          </div>

          {/* Results count */}
          <div className="px-5 py-3 border-b border-gray-200 dark:border-white/[0.05]">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? 'Loading...' : error ? 'Error loading projects' : `Showing ${paginatedProjects.length} of ${filteredProjects.length} projects`}
            </span>
          </div>

          {/* Table */}
          <div className="min-w-full flex-1 overflow-auto custom-scrollbar">
            <Table>
              <TableHeader className="sticky top-0 border-b border-gray-100 dark:border-white/[0.05] bg-gray-200 dark:bg-gray-900">
                <TableRow>
                  <TableCell 
                    isHeader 
                    className="w-[16%] px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Project Name
                  </TableCell>
                  <TableCell 
                    isHeader 
                    className="w-[16%] px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Project Manager
                  </TableCell>
                  {!showSidePanel && (
                    <>
                      <TableCell 
                        isHeader 
                        className="w-[16%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Start Date
                      </TableCell>
                      <TableCell 
                        isHeader 
                        className="w-[16%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        End Date
                      </TableCell>
                    </>
                  )}
                  <TableCell 
                    isHeader 
                    className="w-[16%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Progress
                  </TableCell>
                  <TableCell 
                    isHeader 
                    className="w-[16%] px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell 
                      colSpan={showSidePanel ? 4 : 6}
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading projects...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedProjects.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={showSidePanel ? 4 : 6}
                      className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      {searchQuery ? "No projects match your search criteria." : "No projects found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProjects.map((project) => (
                    <ProjectTableRow
                      key={project.id}
                      project={project}
                      onClick={() => onSelectProject(project)}
                      showDates={!showSidePanel}
                      getStatusBadgeProps={getStatusBadgeProps}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-auto border-t border-gray-200 dark:border-white/[0.05]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}