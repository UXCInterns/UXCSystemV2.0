"use client";

import React, { useRef, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UXCAttendanceTable, { UXCAttendanceTableRef } from "@/components/uxcattendance/AttendanceTable/AttendanceTable";
import ComponentCard from "@/components/common/ComponentCard";
import ExportModal, { ExportFilters } from "@/components/uxcattendance/AttendanceTable/ExportModal";
import { exportWithFilters } from "@/utils/CommonUtils/exportUtils";
import ExportExcelButton from "@/components/common/ExportButton";

export default function UXCTable() {
  const tableRef = useRef<UXCAttendanceTableRef>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExport = (filters: ExportFilters) => {
    if (!tableRef.current) {
      alert('Table data not available');
      return;
    }

    const allData = tableRef.current.getAllData();
    
    if (allData.length === 0) {
      alert('No data to export');
      return;
    }

    exportWithFilters(allData, filters, 'uxc-learning-journey');
  };

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
              <div className="flex items-center gap-4">
                <h4 className="ml-5 text-base sm:text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 sm:line-clamp-1">
                  UXC Learning Journey
                </h4>
              </div>

              <div className="flex items-center gap-4 mr-4">
                <ExportExcelButton
                  onExport={() => setIsExportModalOpen(true)}
                />
              </div>
            </div>
          }
        >
          <UXCAttendanceTable ref={tableRef} />
        </ComponentCard>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        allData={tableRef.current?.getAllData() || []}
      />
    </div>
  );
}