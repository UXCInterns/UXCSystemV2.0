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
import Image from "next/image";

interface Visit {
  id: number;
  projectName: string;
  projectManager: {
    image: string;
    name: string;
  };
  projectLead: {
    image: string;
    name: string;
  };
  coreTeam: {
    images: string[];
  };
  supportTeam: {
    images: string[];
  };
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
}

// Define the table data using the interface
const initialData: Visit[] = [
  {
    id: 1,
    projectName: "Acme Corp",
    projectManager: {
      image: "/images/user/user-01.jpg",
      name: "Lindsey Curtis",
    },
    projectLead: {
      image: "/images/user/user-02.jpg",
      name: "Nathan Wong",
    },
    coreTeam: {
      images: ["/images/user/user-03.jpg", "/images/user/user-04.jpg", "/images/user/user-05.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-06.jpg", "/images/user/user-07.jpg", "/images/user/user-08.jpg"],
    },
    startDate: "15 January 2024",
    endDate: "15 June 2024",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 2,
    projectName: "Globex Inc.",
    projectManager: {
      image: "/images/user/user-09.jpg",
      name: "Sophia Lee",
    },
    projectLead: {
      image: "/images/user/user-10.jpg",
      name: "Daniel Tan",
    },
    coreTeam: {
      images: ["/images/user/user-11.jpg", "/images/user/user-12.jpg", "/images/user/user-13.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-14.jpg", "/images/user/user-15.jpg", "/images/user/user-16.jpg"],
    },
    startDate: "1 October 2023",
    endDate: "30 March 2024",
    priority: "Urgent",
    status: "Completed",
  },
  {
    id: 3,
    projectName: "Wayne Enterprises",
    projectManager: {
      image: "/images/user/user-17.jpg",
      name: "Bruce Wayne",
    },
    projectLead: {
      image: "/images/user/user-18.jpg",
      name: "Rachel Dawes",
    },
    coreTeam: {
      images: ["/images/user/user-19.jpg", "/images/user/user-20.jpg", "/images/user/user-21.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-22.jpg", "/images/user/user-23.jpg", "/images/user/user-24.jpg"],
    },
    startDate: "10 May 2024",
    endDate: "20 November 2024",
    priority: "High",
    status: "In Progress",
  },
  {
    id: 4,
    projectName: "Stark Industries",
    projectManager: {
      image: "/images/user/user-25.jpg",
      name: "Tony Stark",
    },
    projectLead: {
      image: "/images/user/user-26.jpg",
      name: "Pepper Potts",
    },
    coreTeam: {
      images: ["/images/user/user-27.jpg", "/images/user/user-28.jpg", "/images/user/user-29.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-30.jpg", "/images/user/user-01.jpg", "/images/user/user-02.jpg"],
    },
    startDate: "1 July 2023",
    endDate: "31 January 2024",
    priority: "Low",
    status: "Completed",
  },
  {
    id: 5,
    projectName: "Umbrella Corp",
    projectManager: {
      image: "/images/user/user-03.jpg",
      name: "Alice Abernathy",
    },
    projectLead: {
      image: "/images/user/user-04.jpg",
      name: "Dr. Marcus",
    },
    coreTeam: {
      images: ["/images/user/user-05.jpg", "/images/user/user-06.jpg", "/images/user/user-07.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-08.jpg", "/images/user/user-09.jpg", "/images/user/user-10.jpg"],
    },
    startDate: "20 February 2024",
    endDate: "10 September 2024",
    priority: "Medium",
    status: "Aborted",
  },
  {
    id: 6,
    projectName: "Black Mesa",
    projectManager: {
      image: "/images/user/user-11.jpg",
      name: "Gordon Freeman",
    },
    projectLead: {
      image: "/images/user/user-12.jpg",
      name: "Isaac Kleiner",
    },
    coreTeam: {
      images: ["/images/user/user-13.jpg", "/images/user/user-14.jpg", "/images/user/user-15.jpg"],
    },
    supportTeam: {
      images: ["/images/user/user-16.jpg", "/images/user/user-17.jpg", "/images/user/user-18.jpg"],
    },
    startDate: "5 January 2025",
    endDate: "25 July 2025",
    priority: "Urgent",
    status: "In Progress",
  },
];
export { initialData }; 

interface CurrentProjectsTableProps {
  searchQuery: string;
  selectedSort: string;
  onSortChange: (value: string) => void;
} 

export default function CurrentProjectsTable({
  searchQuery,
  selectedSort,
  onSortChange,
}: CurrentProjectsTableProps) {
  const [tableData, setTableData] = useState<Visit[]>(initialData);
  const { closeModal } = useModal();

  const filteredData = tableData.filter((row) =>
    row.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to count current projects
  const currentProjectCount = tableData.length;

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
                  "Project Name",
                  "Project Manager",
                  "Project Lead",
                  "Core Team",
                  "Support Team",
                  "Start Date",
                  "End Date",
                  "Priority",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className={`px-4 py-3 font-large text-gray-500 text-theme-sm dark:text-gray-400 ${
                      header === "Project Name" ? "text-start" : "text-center"
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
                    {row.projectName}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={row.projectManager.image}
                          alt={row.projectManager.name}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {row.projectManager.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                   <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={row.projectLead.image}
                          alt={row.projectLead.name}
                        />
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {row.projectLead.name}
                        </span>
                      </div>
                    </div>
                   </TableCell>
                  <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {row.coreTeam.images.map((coreTeamImage, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                        >
                          <Image
                            width={24}
                            height={24}
                            src={coreTeamImage}
                            alt={`Team member ${index + 1}`}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                   <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex -space-x-2">
                      {row.supportTeam.images.map((supportTeamImage, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                        >
                          <Image
                            width={24}
                            height={24}
                            src={supportTeamImage}
                            alt={`Team member ${index + 1}`}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                     {row.startDate}
                   </TableCell>
                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                     {row.endDate}
                   </TableCell>
                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        row.priority === "Urgent"
                          ? "error"
                          : row.priority === "High"
                          ? "warning"
                          : row.priority === "Medium"
                          ? "primary"
                          : "success"
                      }
                    >
                      {row.priority}
                    </Badge>
                   </TableCell>
                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        row.status === "In Progress"
                          ? "info"
                          : row.status === "Pending"
                          ? "warning"
                          : row.status === "Completed"
                          ? "success"
                          : "light"
                      }
                    >
                      {row.status}
                    </Badge>
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
