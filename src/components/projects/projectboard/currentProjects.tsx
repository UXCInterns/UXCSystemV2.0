// "use client";

// import React, { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../../ui/table";
// import { useModal } from "@/hooks/useModal";
// import { useProjectData, Visit } from "@/hooks/useProjectData"; // Import the hook and type
// import Badge from "../../ui/badge/Badge";
// import Image from "next/image";
// import SearchQuery from "../projectboard/common/searchQuery"; // Assuming this component exists
// import SortDropdown from "../projectboard/common/sortDropdown"; // Assuming this component exists

// interface CurrentProjectsTableProps {
//   searchQuery: string;
//   selectedSort: string;
//   onSortChange: (value: string) => void;
//   setSearchQuery: (value: string) => void;
//   sortBy: string;
//   setSortBy: (value: string) => void;
// } 

// const sortOptions = [
//   { value: "newest", label: "Newest" },
//   { value: "oldest", label: "Oldest" },
//   { value: "name", label: "Project Name" },
//   { value: "priority", label: "Priority" },
//   { value: "status", label: "Status" }
// ];

// export default function CurrentProjectsTable({
//   searchQuery,
//   selectedSort,
//   onSortChange,
//   setSearchQuery,
//   sortBy,
//   setSortBy,
// }: CurrentProjectsTableProps) {
//   const { data: initialData } = useProjectData(); // Get data from the hook
//   const [tableData, setTableData] = useState<Visit[]>(initialData);
//   const { closeModal } = useModal();

//   const filteredData = tableData.filter((row) =>
//     row.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     row.projectManager.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     row.projectLead.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Function to count current projects
//   const currentProjectCount = tableData.length;

//   const handleAddVisit = (newVisit: Omit<Visit, "id">) => {
//     setTableData((prev) => [...prev, { ...newVisit, id: prev.length + 1 }]);
//     closeModal();
//   };

//   const getSortedData = () => {
//     const dataCopy = [...filteredData];
//     switch (selectedSort.toLowerCase()) {
//       case "newest":
//         return dataCopy.sort(
//           (a, b) =>
//             new Date(b.centerDate).getTime() - new Date(a.centerDate).getTime()
//         );
//       case "oldest":
//         return dataCopy.sort(
//           (a, b) =>
//             new Date(a.centerDate).getTime() - new Date(b.centerDate).getTime()
//         );
//       case "name":
//         return dataCopy.sort((a, b) => a.projectName.localeCompare(b.projectName));
//       case "priority":
//         const priorityOrder = { "Urgent": 4, "High": 3, "Medium": 2, "Low": 1 };
//         return dataCopy.sort((a, b) => priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]);
//       case "status":
//         return dataCopy.sort((a, b) => a.status.localeCompare(b.status));
//       default:
//         return dataCopy;
//     }
//   };

//   const sortedData = getSortedData();

//   return (
//     <div className="space-y-4">
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//         <div className="max-w-auto overflow-x-auto">
//           {/* Search on left, Filter + Sort on right */}
          // <div className="flex items-center justify-between px-3 py-4">
          //   <div className="flex items-center gap-4">
          //     <SearchQuery value={searchQuery} onChange={setSearchQuery} />
          //   </div>
          //   <div className="flex items-center gap-4">
          //     <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          //       <svg
          //         className="stroke-current fill-white dark:fill-gray-800"
          //         width="20"
          //         height="20"
          //         viewBox="0 0 20 20"
          //         fill="none"
          //         xmlns="http://www.w3.org/2000/svg"
          //       >
          //         <path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          //         <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          //         <path
          //           d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
          //           strokeWidth="1.5"
          //         />
          //         <path
          //           d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
          //           strokeWidth="1.5"
          //         />
          //       </svg>
          //       Filter
          //     </button> 
          //   </div>
          // </div>
//           <Table className="table-fixed">
//             <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-200 dark:bg-gray-900">
//               <TableRow>
//                 {[
//                   "Project Name",
//                   "Project Manager",
//                   "Project Lead",
//                   "Core Team",
//                   "Support Team",
//                   "center Date",
//                   "End Date",
//                   "Status",
//                   "Actions",
//                 ].map((header) => (
//                   <TableCell
//                     key={header}
//                     isHeader
//                     className={`px-4 py-4 font-large text-gray-500 text-theme-sm dark:text-gray-400 ${
//                       header === "Project Name" ? "text-center" : "text-center"
//                     }`}
//                   >
//                     {header}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHeader>
 
//             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] group">
//               {sortedData.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   className="transition-opacity duration-200 group-hover:opacity-30 hover:!opacity-100"
//                 >
//                   <TableCell
//                     className="px-5 py-4 text-center text-theme-sm text-gray-800 dark:text-white/90 max-w-[200px] truncate overflow-hidden whitespace-nowrap">
//                     {row.projectName}
//                   </TableCell>
//                   <TableCell className="px-5 py-4 sm:px-6 text-center">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 overflow-hidden rounded-full">
//                         <Image
//                           width={40}
//                           height={40}
//                           src={row.projectManager.image}
//                           alt={row.projectManager.name}
//                         />
//                       </div>
//                       <div>
//                         <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                           {row.projectManager.name}
//                         </span>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-5 py-4 sm:px-6 text-center">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 overflow-hidden rounded-full">
//                         <Image
//                           width={40}
//                           height={40}
//                           src={row.projectLead.image}
//                           alt={row.projectLead.name}
//                         />
//                       </div>
//                       <div>
//                         <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                           {row.projectLead.name}
//                         </span>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">
//                     <div className="flex -space-x-2">
//                       {row.coreTeam.images.map((coreTeamImage, index) => (
//                         <div
//                           key={index}
//                           className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
//                         >
//                           <Image
//                             width={24}
//                             height={24}
//                             src={coreTeamImage}
//                             alt={`Team member ${index + 1}`}
//                             className="w-full"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-5 py-4 text-gray-500 text-center text-theme-sm dark:text-gray-400">
//                     <div className="flex -space-x-2">
//                       {row.supportTeam.images.map((supportTeamImage, index) => (
//                         <div
//                           key={index}
//                           className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
//                         >
//                           <Image
//                             width={24}
//                             height={24}
//                             src={supportTeamImage}
//                             alt={`Team member ${index + 1}`}
//                             className="w-full"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
//                     {row.centerDate}
//                   </TableCell>
//                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
//                     {row.endDate}
//                   </TableCell>
//                   <TableCell className="px-5 py-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">
//                     <Badge
//                       size="sm"
//                       color={
//                         row.status === "In Progress"
//                           ? "info"
//                           : row.status === "Pending"
//                           ? "warning"
//                           : row.status === "Completed"
//                           ? "success"
//                           : "light"
//                       }
//                     >
//                       {row.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
//                     <div className="flex justify-center gap-5 items-center">
//                       <button
//                         aria-label="Expand"
//                         className="hover:text-green-600 dark:hover:text-green-400"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="currentColor" d="M17 2a1 1 0 1 0 0 2h1.586l-4.293 4.293a1 1 0 0 0 1.414 1.414L20 5.414V7a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1h-4zM4 18.586V17a1 1 0 1 0-2 0v4a1 1 0 0 0 1 1h4a1 1 0 1 0 0-2H5.414l4.293-4.293a1 1 0 0 0-1.414-1.414L4 18.586z"/></svg>
//                       </button>
//                       <button
//                         aria-label="Edit"
//                         className="hover:text-blue-600 dark:hover:text-blue-400"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 576 512"><path fill="currentColor" d="m402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9L216.2 301.8l-7.3 65.3l65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1l30.9-30.9c4-4.2 4-10.8-.1-14.9z"/></svg>
//                       </button>
//                       <button
//                         aria-label="Delete"
//                         className="hover:text-red-600 dark:hover:text-red-400"
//                       >
//                         <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="4"><path d="M9 10v34h30V10H9Z"/><path strokeLinecap="round" d="M20 20v13m8-13v13M4 10h40"/><path d="m16 10l3.289-6h9.488L32 10H16Z"/></g></svg>
//                       </button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProjectData } from "@/hooks/useProjectData";
import SearchQuery from "../projectboard/common/searchQuery";
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";

export default function ProjectsTable() {
  const { data: projects } = useProjectData();
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7; // number of projects per page

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Projects Overview
            </h4>
          </div>
          <div className="flex items-center gap-4">
            <SearchQuery value={searchQuery} onChange={setSearchQuery} />
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-sm hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
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
          </div>
        </div>
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-200 dark:bg-gray-900">
              <TableRow>
                <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400" isHeader>
                  Project Name
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400" isHeader>
                  Project Manager
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400" isHeader>
                  Project Lead
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400" isHeader>
                  Core Team
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400" isHeader>
                  Support Team
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400" isHeader>
                  Start Date
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400" isHeader>
                  End Date
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400" isHeader>
                  Status
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400" isHeader>
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {project.projectName}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={project.projectManager.image}
                          alt={project.projectManager.name}
                        />
                      </div>
                      <span>{project.projectManager.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={project.projectLead.image}
                          alt={project.projectLead.name}
                        />
                      </div>
                      <span>{project.projectLead.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <div className="flex items-center justify-center -space-x-2">
                      {project.coreTeam.images.map((img, idx) => (
                        <div key={idx} className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900">
                          <Image width={24} height={24} src={img} alt={`Core team ${idx + 1}`} className="w-full" />
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <div className="flex items-center justify-center -space-x-2">
                      {project.supportTeam.images.map((img, idx) => (
                        <div key={idx} className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900">
                          <Image width={24} height={24} src={img} alt={`Support team ${idx + 1}`} className="w-full" />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {project.startDate}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    {project.endDate}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        project.status === "In Progress"
                          ? "error"
                          : project.status === "Pending"
                          ? "warning"
                          : project.status === "Completed"
                          ? "success"
                          : "primary"
                      }
                    >
                      {project.status}
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

        <div className="flex justify-end px-5 py-4 border-t border-gray-200 dark:border-white/[0.05]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
}

