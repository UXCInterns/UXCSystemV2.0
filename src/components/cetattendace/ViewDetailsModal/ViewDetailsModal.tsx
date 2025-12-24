"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { WorkshopDetailsHeader } from "./WorkshopDetailsHeader";
import { WorkshopDetailsContent } from "./WorkshopDetailsContent";
import { WorkshopDetailsModalProps } from "@/types/workshop";

const WorkshopDetailsModal: React.FC<WorkshopDetailsModalProps> = ({
  workshop,
  isOpen,
  onClose,
}) => {
  if (!workshop) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
      <div className="p-6 space-y-6">
        <WorkshopDetailsHeader workshop={workshop} />
        <WorkshopDetailsContent workshop={workshop} />
      </div>
    </Modal>
  );
};

export default WorkshopDetailsModal;