import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import FormSection from "./FormSection";
import { VisitFormData } from "@/types/LearningJourneyAttendanceTypes/visit";

interface ConversionSectionProps {
  formData: VisitFormData;
  onRadioChange: (field: string) => (value: string) => void;
}

const ConversionSection: React.FC<ConversionSectionProps> = ({
  formData,
  onRadioChange,
}) => {
  return (
    <FormSection title="Conversion Outcomes">
      <div className="flex space-x-6">
        <div className="flex-1 space-y-3 border-r border-gray-300 dark:border-gray-800 h-full">
          <Label>Consultancy Conversion</Label>
          <Radio
            id="consultancy-yes"
            name="consultancy"
            value="yes"
            checked={formData.consultancy}
            label="Yes"
            onChange={onRadioChange("consultancy")}
          />
          <Radio
            id="consultancy-no"
            name="consultancy"
            value="no"
            checked={!formData.consultancy}
            label="No"
            onChange={onRadioChange("consultancy")}
          />
        </div>

        <div className="flex-1 space-y-3">
          <Label>Training Conversion</Label>
          <Radio
            id="training-yes"
            name="training"
            value="yes"
            checked={formData.training}
            label="Yes"
            onChange={onRadioChange("training")}
          />
          <Radio
            id="training-no"
            name="training"
            value="no"
            checked={!formData.training}
            label="No"
            onChange={onRadioChange("training")}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default ConversionSection;