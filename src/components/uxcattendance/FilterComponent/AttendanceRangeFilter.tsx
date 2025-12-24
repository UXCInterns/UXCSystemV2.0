import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface AttendanceRangeFilterProps {
  minAttended: number | null;
  maxAttended: number | null;
  onRangeChange: (field: 'min' | 'max', value: string) => void;
}

const AttendanceRangeFilter: React.FC<AttendanceRangeFilterProps> = ({
  minAttended,
  maxAttended,
  onRangeChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold text-gray-900 dark:text-white">
          Attendance Range
        </Label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Filter by number of attendees
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4">
        <div>
          <Label htmlFor="min-attended" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Attendees
          </Label>
          <Input
            id="min-attended"
            type="number"
            min="0"
            value={minAttended || ''}
            onChange={(e) => onRangeChange('min', e.target.value)}
            placeholder="Min attendees"
          />
        </div>
        <div>
          <Label htmlFor="max-attended" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maximum Attendees
          </Label>
          <Input
            id="max-attended"
            type="number"
            min="0"
            value={maxAttended || ''}
            onChange={(e) => onRangeChange('max', e.target.value)}
            placeholder="Max attendees"
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceRangeFilter;