import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface RangeFilterSectionProps {
  title: string;
  description: string;
  minValue: number | null;
  maxValue: number | null;
  minLabel: string;
  maxLabel: string;
  minPlaceholder: string;
  maxPlaceholder: string;
  minId: string;
  maxId: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

export const RangeFilterSection: React.FC<RangeFilterSectionProps> = ({
  title,
  description,
  minValue,
  maxValue,
  minLabel,
  maxLabel,
  minPlaceholder,
  maxPlaceholder,
  minId,
  maxId,
  onMinChange,
  onMaxChange,
}) => {
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
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
        <div>
          <Label
            htmlFor={minId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {minLabel}
          </Label>
          <Input
            id={minId}
            type="number"
            min="0"
            value={minValue || ""}
            onChange={(e) => onMinChange(e.target.value)}
            placeholder={minPlaceholder}
          />
        </div>
        <div>
          <Label
            htmlFor={maxId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {maxLabel}
          </Label>
          <Input
            id={maxId}
            type="number"
            min="0"
            value={maxValue || ""}
            onChange={(e) => onMaxChange(e.target.value)}
            placeholder={maxPlaceholder}
          />
        </div>
      </div>
    </div>
  );
};
