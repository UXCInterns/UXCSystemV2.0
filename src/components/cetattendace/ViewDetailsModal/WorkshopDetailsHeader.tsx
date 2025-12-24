import React from "react";
import Badge from "@/components/ui/badge/Badge";

interface Workshop {
  id: string;
  course_program_title: string;
  program_type: string;
  category?: string;
  csc?: boolean;
}

interface WorkshopDetailsHeaderProps {
  workshop: Workshop;
}

export const WorkshopDetailsHeader: React.FC<WorkshopDetailsHeaderProps> = ({ workshop }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-4">
            {workshop.course_program_title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Workshop ID: {workshop.id}
          </p>
          <div className="mt-2 flex gap-2">
            <Badge
              variant="light"
              color={workshop.program_type === "pace" ? "info" : "primary"}
              size="sm"
            >
              {workshop.program_type === "pace" ? "PACE Program" : "NON-PACE Program"}
            </Badge>
            {workshop.program_type === 'pace' && workshop.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                {workshop.category}
              </span>
            )}
            {workshop.program_type === 'non_pace' && workshop.csc && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                CSC Eligible
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};