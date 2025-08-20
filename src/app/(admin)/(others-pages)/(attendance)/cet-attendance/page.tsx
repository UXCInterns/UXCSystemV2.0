"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CETAttendanceTable  from "../../../../../components/attendance/cetattendace/cetattendance";
import ComponentCard from "../../../../../components/attendance/cetattendace/common/ComponentCard";
import ExportDropdown from "../../../../../components/attendance/cetattendace/common/exportButton";
import ChartTab from "../../../../../components/attendance/cetattendace/common/PaceToggle";

export default function CETTable() {
  return (
    <div>
      <PageBreadcrumb
        pageTitle="CET Training"
        items={[
          { label: "Home", href: "/" },
          { label: "CET Training"},
        ]}
      />
      <div className="space-y-6">
        <ComponentCard
          header={
            <div className="flex justify-between items-center">
              {/* Left group: Search, Filter, Sort */}
              <div className="flex items-center gap-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white ml-5">
                  CET Training
                </h4>
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
        <CETAttendanceTable data={[]}/>
        </ComponentCard>
      </div>
    </div>
  );
}
