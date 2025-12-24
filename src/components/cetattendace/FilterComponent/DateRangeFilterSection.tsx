import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface DateRangeFilterSectionProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export const DateRangeFilterSection: React.FC<DateRangeFilterSectionProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold text-gray-900 dark:text-white">
          Program Date Range
        </Label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Filter by program start dates
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
        <div>
          <Label
            htmlFor="start-date"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            From Date
          </Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
        <div>
          <Label
            htmlFor="end-date"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            To Date
          </Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
