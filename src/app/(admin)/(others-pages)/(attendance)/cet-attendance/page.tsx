"use client";

import React, { useState, useRef } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CETAttendanceTable, { WorkshopTableRef } from "@/components/cetattendace/WorkshopsTable/WorkshopsTable";
import ComponentCard from "@/components/common/ComponentCard";
import ExportExcelButton from "@/components/common/ExportButton";
import ChartTab from "@/components/cetattendace/PaceToggle";
import WorkshopExportModal, { ExportFilters } from "@/components/cetattendace/WorkshopsTable/WorkshopExportModal";
import { exportWorkshopsWithFilters } from "@/utils/CommonUtils/workshopExportUtils";

import WorkshopImportModal from "@/components/cetattendace/WorkshopsTable/WorkshopImportModal";
import ImportExcelButton from "@/components/common/ImportButton";
import type {ImportPreviewData} from "@/components/cetattendace/WorkshopsTable/WorkshopImportModal";




export default function CETTable() {
  const [selectedProgramType, setSelectedProgramType] = useState<"pace" | "non_pace">("pace");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const tableRef = useRef<WorkshopTableRef>(null);

  const handleToggleChange = (type: "pace" | "non_pace") => {
    setSelectedProgramType(type);
  };

  const handleExportClick = () => {
    setIsExportModalOpen(true);
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleImport = async (file: File, previewData: ImportPreviewData) => {
    try {
      const workshopData = previewData.extractedData;
 
      if (!workshopData || workshopData.length === 0) {
        throw new Error('No valid data to import');
      }
 
      if (tableRef.current && 'addData' in tableRef.current) {
        (tableRef.current as any).addData(workshopData);
      }
 
      alert(`Successfully imported ${previewData.rowCount} workshops`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to import file');
    }
  };

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

    // Add program type to filename
    const programTypeSuffix = selectedProgramType === "pace" ? "PACE" : "NON-PACE";
    const filename = `cet-training-${programTypeSuffix.toLowerCase()}`;

    exportWorkshopsWithFilters(allData, filters, filename);
  };

  return (
    <div>
      <PageBreadcrumb
        pageTitle="CET Training"
        items={[
          { label: "Home", href: "/" },
          { label: "CET Training" },
        ]}
      />
      <div className="space-y-6">
        <ComponentCard
          header={
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              {/* Title */}
              <h4 className="ml-5 text-base sm:text-lg font-semibold text-gray-800 dark:text-white line-clamp-2 sm:line-clamp-1">
                CET Training  {selectedProgramType === "pace" ? "PACE" : "NON-PACE"}
              </h4>

              {/* Import , 8iuExport & Toggle */}
              <div className="flex flex-row justify-center md:justify-end items-center gap-2 md:mr-4">
                <ImportExcelButton onClick={handleImportClick}/>
                <ExportExcelButton onExport={handleExportClick} />
                <ChartTab
                  selected={selectedProgramType}
                  onToggle={handleToggleChange}
                />
              </div>
            </div>
          }
        >
          <CETAttendanceTable
            ref={tableRef}
            data={[]}
            programTypeFilter={selectedProgramType}
          />
        </ComponentCard>
      </div>


      {/* Import Modal  */}
      <WorkshopImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />

      {/* Export Modal */}
      <WorkshopExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        allData={tableRef.current?.getAllData() || []}
      />
    </div>
  );
}