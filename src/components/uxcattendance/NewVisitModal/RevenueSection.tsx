import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FormSection from "./FormSection";
import { VisitFormData } from "@/types/LearningJourneyAttendanceTypes/visit";

interface RevenueSectionProps {
  formData: VisitFormData;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RevenueSection: React.FC<RevenueSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <FormSection title="Financial Impact">
      <div>
        <Label>Revenue Generated (SGD)</Label>
        <Input
          type="number"
          placeholder="0.00"
          value={formData.revenue}
          onChange={onInputChange("revenue")}
          min="0"
          step={0.10}
        />
      </div>
    </FormSection>
  );
};

export default RevenueSection;