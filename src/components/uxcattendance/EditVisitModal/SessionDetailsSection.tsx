import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface SessionDetailsSectionProps {
  formData: {
    date_of_visit: string;
    start_time: string;
    end_time: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SessionDetailsSection: React.FC<SessionDetailsSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Session Details
      </h3>
      <div className="space-y-3">
        <div>
          <Label>Date of Visit *</Label>
          <Input
            type="date"
            value={formData.date_of_visit}
            onChange={onInputChange("date_of_visit")}
            error={!!errors.date_of_visit}
            hint={errors.date_of_visit}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Start Time *</Label>
            <Input
              type="time"
              value={formData.start_time}
              onChange={onInputChange("start_time")}
              error={!!errors.start_time}
              hint={errors.start_time}
            />
          </div>
          <div>
            <Label>End Time *</Label>
            <Input
              type="time"
              value={formData.end_time}
              onChange={onInputChange("end_time")}
              error={!!errors.end_time}
              hint={errors.end_time}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsSection;