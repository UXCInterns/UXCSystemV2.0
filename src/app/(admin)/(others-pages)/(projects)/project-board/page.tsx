// "use client";

// import React, { useState } from "react";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import CurrentProjectsTable from "../../../../../components/projects/projectboard/currentProjects"
// import FutureProjectsTable from "../../../../../components/projects/projectboard/futureProjects"
// import ComponentCard from "../../../../../components/projects/projectboard/common/ComponentCard";
// import SearchQuery from "@/components/projects/projectboard/common/searchQuery";
// import SortDropdown from "../../../../../components/projects/projectboard/common/sortDropdown";
// import { ProjectMetrics } from "../../../../../components/projects/projectboard/projectMetrics";
// import StatusChartMetric from "../../../../../components/projects/projectboard/statusChartMetric";
// import PriorityChartMetric from "../../../../../components/projects/projectboard/priortyChartMetric";
// import { PlusIcon } from "@/icons";
// import { initialData } from "../../../../../components/projects/projectboard/currentProjects";
// import { futureData } from "../../../../../components/projects/projectboard/futureProjects";
// import { parse, isAfter, isBefore, startOfMonth, endOfMonth, addMonths } from "date-fns";

// export default function ProjectBoard() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("Newest");
//   const currentProjectCount = initialData.length;
//   const futureProjectCount = futureData.length;
//   const totalProjectsCount = currentProjectCount + futureProjectCount;

//   const now = new Date();
//   const startOfNextMonth = startOfMonth(addMonths(now, 1));
//   const endOfNextMonth = endOfMonth(addMonths(now, 1));

//   // Count how many current projects end next month
//   const dueNextMonthCount = initialData.filter(project => {
//     if (!project.endDate) return false;

//     // Parse "15 June 2024" to Date
//     const endDate = parse(project.endDate, "dd MMMM yyyy", new Date());

//     return isAfter(endDate, startOfNextMonth) && isBefore(endDate, endOfNextMonth);
//   }).length;

//   const sortOptions = ["Newest", "Oldest", "Most Attended", "Least Attended"];
//   return (
//     <div>
//       <PageBreadcrumb
//         pageTitle="Project Board"
//         items={[
//           { label: "Home", href: "/" },
//           { label: "Project Board"},
          
//         ]}
//       />
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//         <ProjectMetrics currentProjectsCount={currentProjectCount} futureProjectsCount={futureProjectCount} totalProjectsCount={totalProjectsCount} dueNextMonthCount={dueNextMonthCount}/>
//         <StatusChartMetric />
//         <PriorityChartMetric />
//       </div>

//       {/* Main content area */}
//       <div className="space-y-6 mt-6">
//         <ComponentCard
//           header={
//             <div className="flex justify-between items-center">
//               {/* Left group: Search, Filter, Sort */}
//               <div className="flex items-center gap-4">
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white/90 ml-5">
//                   Current Projects
//                 </h3>
//               </div>

//               {/* Right group: Export & Log New Visit */}
//               <div className="flex items-center gap-4 mr-4">
//                 <button
//                   // onClick={openModal}
//                   className="flex items-center bg-brand-500 text-white px-4 py-2.5 text-theme-sm font-medium rounded-lg hover:bg-blue-700"
//                 >
//                   Add New Project <PlusIcon className="ml-2" />
//                 </button>
//               </div>
//             </div>
//           }
//         >

//         {/* Search on left, Filter + Sort on right */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-4">
//             <SearchQuery value={searchQuery} onChange={setSearchQuery} />
//           </div>
//           <div className="flex items-center gap-4">
//             <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
//               <svg
//                 className="stroke-current fill-white dark:fill-gray-800"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 20 20"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 <path
//                   d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
//                   strokeWidth="1.5"
//                 />
//                 <path
//                   d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
//                   strokeWidth="1.5"
//                 />
//               </svg>
//               Filter
//             </button>

//             <SortDropdown options={sortOptions} selected={sortBy} onSelect={setSortBy} />
//           </div>
//         </div>

          // <CurrentProjectsTable
          //   searchQuery={searchQuery}
          //   selectedSort={sortBy}
          //   onSortChange={setSortBy}
          // />
//         </ComponentCard>
//       </div>

//       <div className="space-y-6 mt-6">
//         <ComponentCard
//           header={
//             <div className="flex justify-between items-center">
//               {/* Left group: Search, Filter, Sort */}
//               <div className="flex items-center gap-4">
//                 <h3 className="text-base font-medium text-gray-800 dark:text-white/90 ml-5">
//                   Future Projects
//                 </h3>
//               </div>
//             </div>
//           }
//         >

//         {/* Search on left, Filter + Sort on right */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-4">
//             <SearchQuery value={searchQuery} onChange={setSearchQuery} />
//           </div>
//           <div className="flex items-center gap-4">
//             <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
//               <svg
//                 className="stroke-current fill-white dark:fill-gray-800"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 20 20"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                 <path
//                   d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
//                   strokeWidth="1.5"
//                 />
//                 <path
//                   d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
//                   strokeWidth="1.5"
//                 />
//               </svg>
//               Filter
//             </button>

//             <SortDropdown options={sortOptions} selected={sortBy} onSelect={setSortBy} />
//           </div>
//         </div>

//           <FutureProjectsTable
//             searchQuery={searchQuery}
//             selectedSort={sortBy}
//             onSortChange={setSortBy}
//           />
//         </ComponentCard>
//       </div>
//     </div>
//   );
// }
"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";
import { ProjectMetrics } from "@/components/projects/projectboard/ProjectMetrics";
import StatusChartMetric from "@/components/projects/projectboard/statusChartMetric";
import ProjectsTable from "@/components/projects/projectboard/currentProjects";
import ProjectGanttChart from "@/components/projects/projectboard/priortyChartMetric";
// import GanttChart from "@/components/projects/projectboard/priortyChartMetric";

export default function UXCDashboard() {

  return (
    <>
      <PageBreadcrumb
        pageTitle="UXC'S PROJECTS"
        items={[
          { label: "Home", href: "/" },
          { label: "UXC Learning Journey" },
        ]}
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Metrics Section */}
        <div className="col-span-12 xl:col-span-12">
          <ProjectMetrics />
        </div>

        {/* Status Chart */}
        <div className="col-span-12 xl:col-span-9">
          <ProjectGanttChart />
        </div>

        <div className="col-span-12 xl:col-span-3">
          <StatusChartMetric />
        </div>

        {/* Projects Table - Full Width */}
        <div className="col-span-12">
            <ProjectsTable />
        </div>
      </div>
    </>
  );
}