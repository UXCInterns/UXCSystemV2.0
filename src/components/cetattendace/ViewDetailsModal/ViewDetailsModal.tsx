"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { X } from "lucide-react";
import { WorkshopDetailsHeader } from "./WorkshopDetailsHeader";
import { WorkshopDetailsContent } from "./WorkshopDetailsContent";
import { WorkshopDetailsModalProps } from "@/types/WorkshopTypes/workshop";

const WorkshopDetailsModal: React.FC<WorkshopDetailsModalProps> = ({
  workshop,
  isOpen,
  onClose,
}) => {
  if (!workshop || !isOpen) return null;

  return (
    <>
      {/* Mobile Full-Screen Modal */}
      <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="absolute inset-0 flex items-end">
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl max-h-[90vh] flex flex-col animate-slideUp shadow-2xl">
            {/* Mobile Header */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-white/[0.05] bg-white dark:bg-gray-900 rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 truncate pr-2">
                  Workshop Details
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                <WorkshopDetailsHeader workshop={workshop} />
                <WorkshopDetailsContent workshop={workshop} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Modal - Hidden on mobile */}
      <div className="hidden md:block">
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
          <div className="p-6 space-y-6">
            <WorkshopDetailsHeader workshop={workshop} />
            <WorkshopDetailsContent workshop={workshop} />
          </div>
        </Modal>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default WorkshopDetailsModal;