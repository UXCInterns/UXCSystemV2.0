"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { VisitDetailsModalProps } from "@/types/LearningJourneyAttendanceTypes/visit";
import DetailsHeader from "./DetailsHeader";
import CompanyInfoDisplay from "./CompanyInfoDisplay";
import SessionDetailsDisplay from "./SessionDetailsDisplay";
import AttendanceMetricsDisplay from "./AttendanceMetricsDisplay";
import ConversionDisplay from "./ConversionDisplay";
import RevenueDisplay from "./RevenueDisplay";
import SessionCharacteristicsDisplay from "./SessionCharacteristicsDisplay";
import NotesDisplay from "./NotesDisplay";
import MetadataFooter from "./MetadataFooter";

const VisitDetailsModal: React.FC<VisitDetailsModalProps> = ({
  visit,
  isOpen,
  onClose,
}) => {
  if (!visit) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
      <div className="p-6 space-y-6">
        <DetailsHeader visit={visit} />

        <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <CompanyInfoDisplay visit={visit} />
              <SessionDetailsDisplay visit={visit} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <AttendanceMetricsDisplay visit={visit} />
              <ConversionDisplay visit={visit} />
              <RevenueDisplay visit={visit} />
              <SessionCharacteristicsDisplay visit={visit} />
            </div>
          </div>

          {/* Notes - Full Width */}
          <NotesDisplay visit={visit} />

          {/* Metadata Footer */}
          <MetadataFooter visit={visit} />
        </div>
      </div>
    </Modal>
  );
};

export default VisitDetailsModal;