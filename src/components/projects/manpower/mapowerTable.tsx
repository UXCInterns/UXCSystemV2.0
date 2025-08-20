"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useModal } from "@/hooks/useModal";
import Badge from "../../ui/badge/Badge";
import SearchQuery from "./common/searchQuery";
import SortDropdown from "./common/sortDropdown";

interface Visit {
  id: number;
  members: string;
  coreProjects: number;
  supportProjects: number;
  totalProjects: number;
  availability: string;
  futureAvailability: string;
}

const initialData: Visit[] = [
  {
    id: 1,
    members: "Nicholas",
    coreProjects: 5,
    supportProjects: 2,
    totalProjects: 7,
    availability: "Very Busy",
    futureAvailability: "Busy",
  },
  {
    id: 2,
    members: "May",
    coreProjects: 1,
    supportProjects: 5,
    totalProjects: 6,
    availability: "Available",
    futureAvailability: "Available",
  },
  {
    id: 3,
    members: "Geetha",
    coreProjects: 6,
    supportProjects: 1,
    totalProjects: 7,
    availability: "Busy",
    futureAvailability: "Very Busy",
  },
  {
    id: 4,
    members: "Aznan",
    coreProjects: 4,
    supportProjects: 3,
    totalProjects: 7,
    availability: "Available",
    futureAvailability: "Available",
  },
  {
    id: 5,
    members: "Swee Bin",
    coreProjects: 2,
    supportProjects: 4,
    totalProjects: 6,
    availability: "Busy",
    futureAvailability: "Available",
  },
  {
    id: 6,
    members: "Anthea",
    coreProjects: 7,
    supportProjects: 0,
    totalProjects: 7,
    availability: "Very Busy",
    futureAvailability: "Very Busy",
  },
  {
    id: 7,
    members: "Dorothea",
    coreProjects: 3,
    supportProjects: 2,
    totalProjects: 5,
    availability: "Very Busy",
    futureAvailability: "Busy",
  },
  {
    id: 8,
    members: "Zhi Wei",
    coreProjects: 2,
    supportProjects: 2,
    totalProjects: 4,
    availability: "Available",
    futureAvailability: "Available",
  },
  {
    id: 9,
    members: "Soo Yin",
    coreProjects: 4,
    supportProjects: 2,
    totalProjects: 6,
    availability: "Busy",
    futureAvailability: "Very Busy",
  },
  {
    id: 10,
    members: "Diyana",
    coreProjects: 3,
    supportProjects: 3,
    totalProjects: 6,
    availability: "Available",
    futureAvailability: "Available",
  },
  {
    id: 11,
    members: "Marcus",
    coreProjects: 1,
    supportProjects: 3,
    totalProjects: 4,
    availability: "Busy",
    futureAvailability: "Available",
  },
  {
    id: 12,
    members: "Isaac",
    coreProjects: 6,
    supportProjects: 1,
    totalProjects: 7,
    availability: "Very Busy",
    futureAvailability: "Very Busy",
  },
];
export { initialData}

const sortOptions = [
  "Most Core",
  "Least Core",
  "Most Support",
  "Least Support",
  "Most Total",
  "Least Total",
];

export default function ManpowerTable() {
  const [tableData] = useState<Visit[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Most Core"); // Default sort
  const { closeModal } = useModal();

  const filteredData = tableData.filter((row) =>
    row.members.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSortedData = () => {
    const dataCopy = [...filteredData];
    switch (sortBy) {
      case "Most Core":
        return dataCopy.sort((a, b) => b.coreProjects - a.coreProjects);
      case "Least Core":
        return dataCopy.sort((a, b) => a.coreProjects - b.coreProjects);
      case "Most Support":
        return dataCopy.sort((a, b) => b.supportProjects - a.supportProjects);
      case "Least Support":
        return dataCopy.sort((a, b) => a.supportProjects - b.supportProjects);
      case "Most Total":
        return dataCopy.sort((a, b) => b.totalProjects - a.totalProjects);
      case "Least Total":
        return dataCopy.sort((a, b) => a.totalProjects - b.totalProjects);
      default:
        return dataCopy;
    }
  };

  const sortedData = getSortedData();

  return (
    <div className="overflow-hidden rounded-xl border p-2 border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-4 px-4 pt-4">
        <div className="flex items-center gap-4">
          <SearchQuery value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z" strokeWidth="1.5" />
              <path d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z" strokeWidth="1.5" />
            </svg>
            Filter
          </button>
          <SortDropdown options={sortOptions} selected={sortBy} onSelect={setSortBy} />
        </div>
      </div>

    <div className="w-full max-h-[474px] overflow-y-auto custom-scrollbar">
        <Table className="min-w-full table-fixed">
          <TableHeader className="sticky top-0 z-10 border-b bg-gray-200 dark:bg-gray-900 border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {["Members", "Core Team", "Support Team", "Total Projects", "Availability", "Future Availability"].map((header) => (
                <TableCell
                  key={header}
                  isHeader
                  className={`px-4 py-4 font-large text-gray-500 text-theme-sm dark:text-gray-400 ${
                    header === "Members" ? "text-start" : "text-center"
                  }`}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] group">
            {sortedData.map((row) => (
              <TableRow key={row.id} className="transition-opacity duration-200 group-hover:opacity-30 hover:!opacity-100">
                <TableCell className="px-5 py-3 text-start text-theme-sm text-gray-800 dark:text-white/90 max-w-[200px] truncate overflow-hidden whitespace-nowrap">
                  {row.members}
                </TableCell>
                <TableCell className="px-5 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {row.coreProjects}
                </TableCell>
                <TableCell className="px-5 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {row.supportProjects}
                </TableCell>
                <TableCell className="px-5 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                  {row.totalProjects}
                </TableCell>
                <TableCell className="px-5 py-3 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      row.availability === "Very Busy"
                        ? "error"
                        : row.availability === "Busy"
                        ? "warning"
                        : "success"
                    }
                  >
                    {row.availability}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-3 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      row.futureAvailability === "Very Busy"
                        ? "error"
                        : row.futureAvailability === "Busy"
                        ? "warning"
                        : "success"
                    }
                  >
                    {row.futureAvailability}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
