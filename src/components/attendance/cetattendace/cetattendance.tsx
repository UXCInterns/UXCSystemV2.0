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

interface Visit {
  id: number;
  programTitle: string;
  noOfPax: number;
  traineeHours: number;
  startDate: string;
  endDate: string;
}

// Define the table data using the interface
const initialData: Visit[] = [
  {
    id: 1,
    programTitle: "SSG",
    noOfPax: 10,
    traineeHours: 32,
    startDate: "7 June 2024",
    endDate: "27 June 2024",
  },
  {
    id: 2,
    programTitle: "RI",
    noOfPax: 23,
    traineeHours: 22,
    startDate: "9 April 2025",
    endDate: "2 May 2025",
  },
  {
    id: 3,
    programTitle: "1-Group",
    noOfPax: 49,
    traineeHours: 31,
    startDate: "10 June 2025",
    endDate: "27 June 2025",
  },
];

interface CETAttendanceTableProps {
  searchQuery: string;
  selectedSort: string;
  onSortChange: (value: string) => void;
} 

export default function CETAttendanceTable({
  searchQuery,
  selectedSort,
  onSortChange,
}: CETAttendanceTableProps) {
  const [tableData, setTableData] = useState<Visit[]>(initialData);
  const { closeModal } = useModal();

  const filteredData = tableData.filter((row) =>
    row.programTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVisit = (newVisit: Omit<Visit, "id">) => {
    setTableData((prev) => [...prev, { ...newVisit, id: prev.length + 1 }]);
    closeModal();
  };

  const getSortedData = () => {
    const dataCopy = [...filteredData];
    switch (selectedSort) {
      case "Newest":
        return dataCopy.sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      case "Oldest":
        return dataCopy.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      case "Most Trainee Hours":
        return dataCopy.sort((a, b) => b.traineeHours - a.traineeHours);
      case "Least Trainee Hours":
        return dataCopy.sort((a, b) => a.traineeHours - b.traineeHours);
      case "Most Attended":
        return dataCopy.sort((a, b) => b.noOfPax - a.noOfPax);
      case "Least Attended":
        return dataCopy.sort((a, b) => a.noOfPax - b.noOfPax);
      default:
        return dataCopy;
    }
  };

  const sortedData = getSortedData();

  return (
       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
         <div className="max-w-auto overflow-x-auto">
           <Table className="table-fixed">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  "Program Title",
                  "No. of Pax",
                  "Trainee Hours",
                  "Start Date",
                  "End Date",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className={`px-4 py-3 font-large text-gray-500 text-theme-sm dark:text-gray-400 ${
                      header === "Program Title" ? "text-start" : "text-center"
                    }`}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
 
             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] group">
               {sortedData.map((row) => (
                 <TableRow
                   key={row.id}
                   className="transition-opacity duration-200 group-hover:opacity-30 hover:!opacity-100"
                 >
                  <TableCell
                    className="px-5 py-4 text-start text-theme-sm text-gray-800 dark:text-white/90 max-w-[200px] truncate overflow-hidden whitespace-nowrap">
                    {row.programTitle}
                  </TableCell>
                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400 flex justify-center items-center gap-1">
                     {row.noOfPax}
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M1 20v-2.8q0-.85.438-1.563T2.6 14.55q1.55-.775 3.15-1.163T9 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T17 17.2V20H1Zm18 0v-3q0-1.1-.613-2.113T16.65 13.15q1.275.15 2.4.513t2.1.887q.9.5 1.375 1.112T23 17v3h-4ZM9 12q-1.65 0-2.825-1.175T5 8q0-1.65 1.175-2.825T9 4q1.65 0 2.825 1.175T13 8q0 1.65-1.175 2.825T9 12Zm10-4q0 1.65-1.175 2.825T15 12q-.275 0-.7-.063t-.7-.137q.675-.8 1.038-1.775T15 8q0-1.05-.362-2.025T13.6 4.2q.35-.125.7-.163T15 4q1.65 0 2.825 1.175T19 8Z"/></svg>
                   </TableCell>
                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                     {row.traineeHours}
                   </TableCell>
                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                     {row.startDate}
                   </TableCell>
                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                     {row.endDate}
                   </TableCell>
                   <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                       <div className="flex justify-center gap-5 items-center">
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
  );
}
