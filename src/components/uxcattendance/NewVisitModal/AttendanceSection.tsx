import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FormSection from "./FormSection";
import { VisitFormData, FormErrors } from "@/types/LearningJourneyAttendanceTypes/visit";

interface AttendanceSectionProps {
  formData: VisitFormData;
  errors: FormErrors;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AttendanceSection: React.FC<AttendanceSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <FormSection title="Attendance Information">
      <div className="space-y-3">
        <div>
          <Label>Total Registered *</Label>
          <Input
            type="number"
            placeholder="0"
            value={formData.total_registered}
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
            value={formData.total_attended}
            onChange={onInputChange("total_attended")}
            min="0"
            error={!!errors.total_attended}
            hint={errors.total_attended}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default AttendanceSection;