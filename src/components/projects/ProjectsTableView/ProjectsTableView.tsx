import React from "react";
import Pagination from "@/components/common/Pagination";
import { Project } from "@/types/ProjectsTypes/project";
import ProjectTableRow from "./ProjectTableRow";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import SearchQuery from "@/components/common/SearchQuery";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table/index";
import Badge, { BadgeColor, BadgeVariant } from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";

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
  getStatusBadgeProps: (status: string) => {
    color?: BadgeColor;
    variant?: BadgeVariant;
  };
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-white/[0.05] gap-3">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Projects Table
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 sm:flex-initial">
                <SearchQuery value={searchQuery} onChange={onSearchChange} />
              </div>
              <Button
                onClick={onNewProject}
                variant="primary"
                size="sm"
                startIcon={<PlusIcon />}
                className="py-3 whitespace-nowrap"
              >
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>

          {/* Results count */}
          <div className="px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-white/[0.05]">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? 'Loading...' : error ? 'Error loading projects' : `Showing ${paginatedProjects.length} of ${filteredProjects.length} projects`}
            </span>
          </div>

          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block min-w-full flex-1 overflow-auto custom-scrollbar">
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

          {/* Mobile Card View - Visible only on mobile */}
          <div className="md:hidden flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading projects...
                </div>
              </div>
            ) : paginatedProjects.length === 0 ? (
              <div className="flex items-center justify-center py-12 px-4">
                <p className="text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? "No projects match your search criteria." : "No projects found."}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {paginatedProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="bg-gray-50 dark:bg-white/[0.02] rounded-xl border border-gray-200 dark:border-white/[0.05] overflow-hidden hover:shadow-md hover:border-gray-300 dark:hover:border-white/[0.1] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-white/[0.05]">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex-1 pr-2 line-clamp-2">
                          {project.project_name}
                        </h3>
                        <Badge size="sm" {...getStatusBadgeProps(project.status)}>
                          {project.status}
                        </Badge>
                      </div>

                      {/* Project Manager */}
                      <div className="flex items-center gap-3">
                        <Avatar 
                          src={project.project_manager.avatar_url}
                          name={project.project_manager.name}
                          size="medium"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {project.project_manager.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {project.project_manager.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 bg-white dark:bg-white/[0.01]">
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            Start Date
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {project.start_date}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                            End Date
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white font-medium">
                            {project.end_date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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