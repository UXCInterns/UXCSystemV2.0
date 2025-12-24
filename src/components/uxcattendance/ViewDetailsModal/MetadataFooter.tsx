import React from "react";
import Label from "@/components/form/Label";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";

interface MetadataFooterProps {
  visit: Visit;
}

const MetadataFooter: React.FC<MetadataFooterProps> = ({ visit }) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <Label className="text-xs">Record Created</Label>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(visit.created_at).toLocaleString("en-SG")}
          </p>
        </div>
        <div>
          <Label className="text-xs">Last Updated</Label>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(visit.updated_at).toLocaleString("en-SG")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetadataFooter;