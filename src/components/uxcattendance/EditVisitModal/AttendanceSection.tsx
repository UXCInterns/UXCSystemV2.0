import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface AttendanceSectionProps {
  formData: {
    total_registered: number;
    total_attended: number;
  };
  errors: Record<string, string>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Attendance Information
      </h3>
      <div className="space-y-3">
        <div>
          <Label>Total Registered *</Label>
          <Input
            type="number"
            placeholder="0"
            value={formData.total_registered ?? ""}
            onChange={onInputChange("total_registered")}
            min="0"
            error={!!errors.total_registered}
            hint={errors.total_registered}
          />
        </div>
        <div>
          <Label>Total Attended *</Label>
          <Input
            type="number"
            placeholder="0"
            value={formData.total_attended ?? ""}
            onChange={onInputChange("total_attended")}
            min="0"
            error={!!errors.total_attended}
            hint={errors.total_attended}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceSection;