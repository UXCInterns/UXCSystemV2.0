import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onDateChange: (field: 'startDate' | 'endDate', value: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onDateChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold text-gray-900 dark:text-white">
          Visit Date Range
        </Label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Filter by visit dates
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
        <div>
          <Label htmlFor="start-date" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Date
          </Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onDateChange('startDate', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="end-date" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To Date
          </Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onDateChange('endDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangeFilter;