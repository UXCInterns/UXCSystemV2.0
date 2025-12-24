import React from "react";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";

interface CSCFilterSectionProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CSCFilterSection: React.FC<CSCFilterSectionProps> = ({
  checked,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold text-gray-900 dark:text-white">
          CSC Programs
        </Label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Civil Service College programs only
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <Checkbox
          label="Show CSC programs only"
          checked={checked}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
