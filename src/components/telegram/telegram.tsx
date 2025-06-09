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

interface Visit {
  id: number;
  fullName: string;
  userName: string;
  telegramId: number;
  status: string;
}

const initialData: Visit[] = [
  {
    id: 1,
    fullName: "May",
    userName: "@may",
    telegramId: 2131234,
    status: "Active",
  },
  {
    id: 2,
    fullName: "John Doe",
    userName: "@johndoe",
    telegramId: 3457699,
    status: "Active",
  },
  {
    id: 3,
    fullName: "Jane Smith",
    userName: "@janesmith",
    telegramId: 4356789,
    status: "Inactive",
  },
];

interface InnoPollProps {
  searchQuery: string;
}

export default function Telegram({ searchQuery }: InnoPollProps) {
  const [tableData, setTableData] = useState<Visit[]>(initialData);
  const { closeModal } = useModal();

  const filteredData = tableData.filter((row) =>
    row.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVisit = (newVisit: Omit<Visit, "id">) => {
    setTableData((prev) => [...prev, { ...newVisit, id: prev.length + 1 }]);
    closeModal();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-auto overflow-x-auto">
        <Table className="table-fixed">
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {["Full Name", "User Name", "Telegram ID", "Status", "Actions"].map((header) => (
                <TableCell
                  key={header}
                  isHeader
                  className={`px-5 py-3 font-large text-gray-500 text-theme-sm dark:text-gray-400 ${
                    header === "Full Name" ? "text-start" : "text-center"
                  }`}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] group">
            {filteredData.map((row) => (
              <TableRow
                key={row.id}
                className="transition-opacity duration-200 group-hover:opacity-30 hover:!opacity-100"
              >
                <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90 max-w-[200px] truncate overflow-hidden whitespace-nowrap">
                  {row.fullName}
                </TableCell>
                <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                  {row.userName}
                </TableCell>
                <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                  {row.telegramId}
                </TableCell>
                <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      row.status === "Active"
                        ? "success"
                        : "error"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                  <div className="flex justify-center gap-5 items-center">
                    <button
                      aria-label="Deactivate"
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14V5c-1.5.167-5 0-7-2c-.571.571-1.265.993-2 1.3M5 5v9c0 4 7 7 7 7s3.204-1.373 5.277-3.5M3 3l18 18"/>
                      </svg>
                    </button>
                    <button
                      aria-label="Delete"
                      className="hover:text-red-600 dark:hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48">
                        <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4">
                          <path d="M9 10v34h30V10H9Z"/>
                          <path strokeLinecap="round" d="M20 20v13m8-13v13M4 10h40"/>
                          <path d="m16 10l3.289-6h9.488L32 10H16Z"/>
                        </g>
                      </svg>
                    </button>
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
