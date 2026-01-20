import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { NewWorkshopFormData } from "@/types/WorkshopTypes/workshop";

interface ScheduleSectionProps {
  formData: NewWorkshopFormData;
  errors: Record<string, string>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Schedule & Duration
      </h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Start Date *</Label>
            <Input
              type="date"
              value={formData.program_start_date}
              onChange={onInputChange("program_start_date")}
              error={!!errors.program_start_date}
              hint={errors.program_start_date}
            />
          </div>
          <div>
            <Label>End Date *</Label>
            <Input
              type="date"
              value={formData.program_end_date}
              onChange={onInputChange("program_end_date")}
              error={!!errors.program_end_date}
              hint={errors.program_end_date}
            />
          </div>
        </div>
        <div>
          <Label>Course Hours</Label>
          <Input
            type="number"
            placeholder="Total course hours"
            value={formData.course_hours}
            onChange={onInputChange("course_hours")}
            min="0"
            error={!!errors.course_hours}
            hint={errors.course_hours}
          />
        </div>
      </div>
    </div>
  );
};