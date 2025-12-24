import React from "react";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";

interface DetailsHeaderProps {
  visit: Visit;
}

const DetailsHeader: React.FC<DetailsHeaderProps> = ({ visit }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {visit.company_name}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Visit ID: {visit.id}
      </p>
    </div>
  );
};

export default DetailsHeader;