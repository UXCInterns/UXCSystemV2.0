"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CETAttendanceTable, { initialData }  from "../../../../../components/attendance/cetattendace/cetattendance";
import ComponentCard from "../../../../../components/attendance/cetattendace/common/ComponentCard";
import SearchQuery from "@/components/attendance/cetattendace/common/searchQuery";
import SortDropdown from "../../../../../components/attendance/cetattendace/common/sortDropdown";
import Pagination from "@/components/attendance/cetattendace/common/Pagination";
import ExportDropdown from "../../../../../components/attendance/cetattendace/common/exportButton";
import ChartTab from "../../../../../components/attendance/cetattendace/common/PaceToggle";
import NewVisitForm from "@/components/attendance/cetattendace/common/newVisitForm";

import { PlusIcon } from "@/icons";
import { useModal } from "@/hooks/useModal";

interface Visit {
  id: number;
  programTitle: string;
  noOfPax: number;
  traineeHours: number;
  startDate: string;
  endDate: string;
}

export default function CETTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [tableData, setTableData] = useState<Visit[]>(initialData);
  const { isOpen, openModal, closeModal } = useModal();

  const sortOptions = ["Newest", "Oldest", "Most Trainee Hours", "Least Trainee Hours","Most Attended", "Least Attended"];

  const filteredData = tableData.filter((row) =>
    row.programTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSortedData = () => {
  const dataCopy = [...filteredData];
    switch (sortBy) {
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

  const handleAddVisit = (newVisit: Omit<Visit, "id">) => {
    setTableData((prev) => [...prev, { ...newVisit, id: prev.length + 1 }]);
    closeModal();
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="CET Training" />
      <div className="space-y-6">
        <ComponentCard
          header={
            <div className="flex justify-between items-center">
              {/* Left group: Search, Filter, Sort */}
              <div className="flex items-center gap-4">
                <SearchQuery value={searchQuery} onChange={setSearchQuery} />
              </div>

              {/* Right group: Export & Log New Visit */}
              <div className="flex items-center gap-4 mr-4">
                <ExportDropdown
                  options={["Export as PDF", "Export as CSV", "Export as XLSX"]}
                  onSelect={(format) => {
                    if (format === "Export as PDF") {
                      // exportPDF();
                    } else if (format === "Export as CSV") {
                      // exportCSV();
                    } else if (format === "Export as XLSX") {
                      // exportXLSX();
                    }
                  }}
                />
                <ChartTab />

              </div>
            </div>
          }
        >

        <div className="flex items-center justify-between mb-4">
          {/* Left-side controls: Filter and Sort */}
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
                <path
                  d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                  strokeWidth="1.5"
                />
              </svg>
              Filter
            </button>

            <SortDropdown options={sortOptions} selected={sortBy} onSelect={setSortBy} />
          </div>

          {/* Right-side button: Log New Visit */}
          <button
            onClick={openModal}
            className="flex items-center bg-brand-500 text-white px-4 py-2.5 text-theme-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Log New Visit <PlusIcon className="ml-2" />
          </button>
        </div>

          <CETAttendanceTable data={sortedData}/>

          {isOpen && (
            <NewVisitForm isOpen={isOpen} onClose={closeModal} onSubmit={handleAddVisit} />
          )}

          <Pagination
            currentPage={1}
            totalPages={10}
            onPageChange={(page: number): void => {
              // Implement pagination logic here
            }}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
