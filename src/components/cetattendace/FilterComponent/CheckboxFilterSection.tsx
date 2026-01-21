import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import { getDisplayLabel, filterOptions } from "@/utils/WorkshopAttendanceUtils/FilterComponentUtils/filterUtils";

interface CheckboxFilterSectionProps {
  title: string;
  description: string;
  category: "courseTypes" | "categories" | "biaLevels";
  options: string[];
  searchPlaceholder: string;
  searchValue: string;
  selectedValues: string[];
  onSearchChange: (value: string) => void;
  onCheckboxChange: (value: string, checked: boolean) => void;
}

export const CheckboxFilterSection: React.FC<CheckboxFilterSectionProps> = ({
  title,
  description,
  category,
  options,
  searchPlaceholder,
  searchValue,
  selectedValues,
  onSearchChange,
  onCheckboxChange,
}) => {
  const filteredOptions = filterOptions(options, searchValue, category);

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </Label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mb-3"
        />
        <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
          {filteredOptions.map((option) => (
            <Checkbox
              key={option}
              label={getDisplayLabel(category, option)}
              checked={selectedValues.includes(option)}
              onChange={(checked) => onCheckboxChange(option, checked)}
            />
          ))}
          {filteredOptions.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
              No options found matching &quot;{searchValue}&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  );
};