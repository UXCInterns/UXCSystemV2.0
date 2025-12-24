import React from "react";
import Label from "@/components/form/Label";

interface Workshop {
  created_at: string;
  updated_at: string;
}

interface MetadataFooterProps {
  workshop: Workshop;
}

export const MetadataFooter: React.FC<MetadataFooterProps> = ({ workshop }) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <Label className="text-xs">Record Created</Label>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(workshop.created_at).toLocaleString("en-GB")}
          </p>
        </div>
        <div>
          <Label className="text-xs">Last Updated</Label>
          <p className="text-gray-600 dark:text-gray-400">
            {new Date(workshop.updated_at).toLocaleString("en-GB")}
          </p>
        </div>
      </div>
    </div>
  );
};