"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useModal } from "@/hooks/useModal";
import Badge from "../ui/badge/Badge";
import SearchQuery from "./common/searchQuery";
import { MoreDotIcon } from "@/icons";
import SortDropdown from "./common/sortDropdown";

interface Project {
  id: number;
  name: string;
  roles: ("Manager" | "Lead" | "Support" | "Core")[];
  endDate: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
}

export const projectData: Project[] = [
  {
    id: 1,
    name: "Digital Transformation",
    roles: ["Manager", "Core", "Lead"],
    endDate: "2025-07-15",
    priority: "High",
  },
  {
    id: 2,
    name: "Intranet Revamp",
    roles: ["Support"],
    endDate: "2025-08-01",
    priority: "Medium",
  },
  {
    id: 3,
    name: "Cloud Migration",
    roles: ["Lead", "Core"],
    endDate: "2025-09-10",
    priority: "High",
  },
  {
    id: 4,
    name: "Customer Portal",
    roles: ["Core"],
    endDate: "2025-07-30",
    priority: "Low",
  },
  {
    id: 5,
    name: "Data Warehouse",
    roles: ["Support", "Lead"],
    endDate: "2025-10-05",
    priority: "Medium",
  },
  {
    id: 6,
    name: "Digital Transformation",
    roles: ["Manager", "Core"],
    endDate: "2025-07-15",
    priority: "High",
  },
  {
    id: 7,
    name: "Intranet Revamp",
    roles: ["Support"],
    endDate: "2025-08-01",
    priority: "Medium",
  },
  {
    id: 8,
    name: "Cloud Migration",
    roles: ["Lead", "Core"],
    endDate: "2025-09-10",
    priority: "High",
  },
  {
    id: 9,
    name: "Customer Portal",
    roles: ["Core"],
    endDate: "2025-07-30",
    priority: "Low",
  },
  {
    id: 10,
    name: "Data Warehouse",
    roles: ["Support", "Lead"],
    endDate: "2025-10-05",
    priority: "Medium",
  },
];

function formatDate(dateStr: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return new Date(dateStr).toLocaleDateString("en-GB", options);
}

function getRoleColor(role: string) {
  switch (role) {
    case "Manager":
      return "error";
    case "Lead":
      return "warning";
    case "Support":
      return "success";
    case "Core":
    default:
      return "primary";
  }
}

const sortOptions = ["None", "Most Imortant", "Latest", "Upcoming"];

function sortProjects(projects: Project[], sortBy: string): Project[] {
  const dataCopy = [...projects];
  if (sortBy === "Most Imortant") {
    const rank = { Urgent: 1, High: 2, Medium: 3, Low: 4 };
    return dataCopy.sort((a, b) => rank[a.priority] - rank[b.priority]);
  }
  if (sortBy === "Latest") {
    return dataCopy.sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    );
  }
  if (sortBy === "Upcoming") {
    return dataCopy.sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    );
  }
  return dataCopy;
}

export default function ProjectTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState("None");
  const { closeModal } = useModal();

  const filteredData = projectData.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.roles.some((role) =>
        role.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const sortedData = sortProjects(filteredData, sortOption);

  return (
    <div className="overflow-hidden rounded-xl border p-2 border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-4 px-4 pt-4">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">My Projects</h2>
        <div className="flex items-center gap-4">
          <SearchQuery value={searchQuery} onChange={setSearchQuery} />
          <SortDropdown
            options={sortOptions}
            selected={sortOption}
            onSelect={setSortOption}
          />
        </div>
      </div>

      <div className="w-full max-h-[350px] overflow-y-auto custom-scrollbar">
        <Table className="min-w-full table-fixed">
          <TableHeader className="sticky top-0 z-10 border-b bg-gray-200 dark:bg-gray-900 border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {["Project Name", "Role", "End Date", "Priority", "Actions"].map(
                (header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className={`px-4 py-3 font-bold text-gray-500 text-theme-sm dark:text-gray-400 ${
                      header === "Project Name" || header === "Role" || header === "End Date"
                        ? "text-left"
                        : "text-center"
                    }`}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] group">
            {sortedData.map((project) => (
              <TableRow
                key={project.id}
                className="transition-opacity duration-200 group-hover:opacity-30 hover:!opacity-100"
              >
                <TableCell className="px-5 py-3 text-left text-theme-sm text-gray-800 dark:text-white/90">
                  {project.name}
                </TableCell>
                <TableCell className="px-5 py-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">
                  <div className="flex flex-wrap gap-1">
                    {project.roles.map((role, idx) => (
                      <Badge key={idx} size="sm" color={getRoleColor(role)}>
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-5 py-3 text-left text-theme-sm text-gray-500 dark:text-gray-400">
                  {formatDate(project.endDate)}
                </TableCell>
                <TableCell className="px-5 py-3 text-center">
                  <Badge
                    size="sm"
                    color={
                      project.priority === "High"
                        ? "warning"
                        : project.priority === "Medium"
                        ? "primary"
                        : project.priority === "Low"
                        ? "success"
                        : "error"
                    }
                  >
                    {project.priority}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-3 text-center relative">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() =>
                        setDropdownOpen(
                          dropdownOpen === project.id ? null : project.id
                        )
                      }
                      className="focus:outline-none"
                    >
                      <MoreDotIcon className="rotate-90 text-gray-500 dark:text-gray-400" />
                    </button>
                    {dropdownOpen === project.id && (
                      <div className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark">
                        <button
                          onClick={() => {
                            closeModal();
                            setDropdownOpen(null);
                          }}
                          className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          View More
                        </button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
