"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UXCAttendanceTable from "@/components/attendance/uxcattendance/uxcattendance";
import ComponentCard from "@/components/attendance/uxcattendance/common/ComponentCard";
import ExportDropdown from "@/components/attendance/uxcattendance/common/exportButton";

export default function UXCTable() {
  return (
    <div>
      <PageBreadcrumb
        pageTitle="UXC Learning Journey"
        items={[
          { label: "Home", href: "/" },
          { label: "UXC Learning Journey"},
          
        ]}
      />
      <div className="space-y-6">
        <ComponentCard
          header={
            <div className="flex justify-between items-center">
              {/* Left group: Search, Filter, Sort */}
              <div className="flex items-center gap-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white ml-5">
                  UXC Learning Journey
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
              </div>
            </div>
          }
        >

          <UXCAttendanceTable />
        </ComponentCard>
      </div>
    </div>
  );
}
