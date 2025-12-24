import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FormSection from "./FormSection";
import { VisitFormData, FormErrors } from "@/types/LearningJourneyAttendanceTypes/visit";

interface SessionDetailsSectionProps {
  formData: VisitFormData;
  errors: FormErrors;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SessionDetailsSection: React.FC<SessionDetailsSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <FormSection title="Session Details">
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
        <div>
          <Label>Session Type (Auto-calculated)</Label>
          <Input
            type="text"
            value={formData.session_type}
            disabled
            placeholder="Will be calculated from start time"
            className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Automatically set to AM (before 12:00) or PM (12:00 and after)
          </p>
        </div>
      </div>
    </FormSection>
  );
};

export default SessionDetailsSection;