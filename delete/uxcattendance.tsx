"use client";

import { useState } from "react";
import SearchQuery from "../attendance/searchQuery";
import NewVisitForm from "../attendance/newVisitForm";
import { useModal } from "@/hooks/useModal";
import Pagination from "../common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Visit {
  id: number;
  companyName: string;
  dateOfVisit: string;
  totalAttended: number;
  durationHours: string;
  conversionStatus: string;
}

const initialData: Visit[] = [
  {
    id: 1,
    companyName: "Acme Corp",
    dateOfVisit: "10 March 2025",
    totalAttended: 32,
    durationHours: "2h 30m",
    conversionStatus: "72%",
  },
  {
    id: 2,
    companyName: "Globex Inc.",
    dateOfVisit: "7 June 2024",
    totalAttended: 18,
    durationHours: "1h 45m",
    conversionStatus: "55%",
  },
  {
    id: 3,
    companyName: "Wayne Enterprises",
    dateOfVisit: "11 September 2006",
    totalAttended: 25,
    durationHours: "2h",
    conversionStatus: "60%",
  },
];

export default function UXCTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tableData, setTableData] = useState<Visit[]>(initialData);
  const { isOpen, openModal, closeModal } = useModal();
  
  const filteredData = tableData.filter((row) =>
    row.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVisit = (newVisit: Omit<Visit, "id">) => {
    setTableData((prev) => [...prev, { ...newVisit, id: prev.length + 1 }]);
    closeModal();
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex justify-between items-center">
          <SearchQuery value={searchQuery} onChange={setSearchQuery} />
          <div className="ml-auto mr-4">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Filter
          </button>
          </div>
          <button
            onClick={openModal}
            className="bg-brand-500 text-white w-auto p-4 mr-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Log New Visit +
          </button>
        </div>

        <div className="max-w-auto overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Company Name",
                  "Date of Visit",
                  "Total Attended",
                  "Duration",
                  "Conversion",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-500 text-theme-sm dark:text-gray-400 ${
                      header === "Company Name" ? "text-start" : "text-center"
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
                  <TableCell className="px-4 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    {row.companyName}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    {row.dateOfVisit}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400 flex justify-center items-center gap-1">
                    {row.totalAttended}
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M1 20v-2.8q0-.85.438-1.563T2.6 14.55q1.55-.775 3.15-1.163T9 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20H1Zm18 0v-3q0-1.1-.613-2.113T16.65 13.15q1.275.15 2.4.513t2.1.887q.9.5 1.375 1.112T23 17v3h-4ZM9 12q-1.65 0-2.825-1.175T5 8q0-1.65 1.175-2.825T9 4q1.65 0 2.825 1.175T13 8q0 1.65-1.175 2.825T9 12Zm10-4q0 1.65-1.175 2.825T15 12q-.275 0-.7-.063t-.7-.137q.675-.8 1.038-1.775T15 8q0-1.05-.362-2.025T13.6 4.2q.35-.125.7-.163T15 4q1.65 0 2.825 1.175T19 8Z"/></svg>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    {row.durationHours}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    {row.conversionStatus}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                      <div className="flex justify-center gap-3 items-center">
                        <button
                          aria-label="Expand"
                          className="hover:text-green-600 dark:hover:text-green-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M17 2a1 1 0 1 0 0 2h1.586l-4.293 4.293a1 1 0 0 0 1.414 1.414L20 5.414V7a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1h-4zM4 18.586V17a1 1 0 1 0-2 0v4a1 1 0 0 0 1 1h4a1 1 0 1 0 0-2H5.414l4.293-4.293a1 1 0 0 0-1.414-1.414L4 18.586z"/></svg>
                        </button>
                        <button
                          aria-label="Edit"
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 576 512"><path fill="currentColor" d="m402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9L216.2 301.8l-7.3 65.3l65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1l30.9-30.9c4-4.2 4-10.8-.1-14.9z"/></svg>
                        </button>
                        <button
                          aria-label="Delete"
                          className="hover:text-red-600 dark:hover:text-red-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M9 10v34h30V10H9Z"/><path strokeLinecap="round" d="M20 20v13m8-13v13M4 10h40"/><path d="m16 10l3.289-6h9.488L32 10H16Z"/></g></svg>
                        </button>
                      </div>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination currentPage={1} totalPages={3} onPageChange={function (page: number): void {
          throw new Error("Function not implemented.");
        } } />
      </div>
      {isOpen && (
        <NewVisitForm isOpen={isOpen} onClose={closeModal} onSubmit={handleAddVisit} />
      )}
    </div>
  );
}

