import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import { NewWorkshopFormData } from "@/types/workshop";

interface AdditionalInfoSectionProps {
  formData: NewWorkshopFormData;
  biaLevelOptions: Array<{ value: string; label: string }>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRadioChange: (field: string) => (value: string) => void;
  onTextAreaChange: (field: string) => (value: string) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  formData,
  biaLevelOptions,
  onInputChange,
  onRadioChange,
  onTextAreaChange,
}) => {
  return (
    <>
      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
          Additional Information
        </h3>
        <div className="space-y-4">
          {/* BIA Level */}
          <div>
            <Label>BIA Level</Label>
            <div className="flex space-x-6 mt-2">
              {biaLevelOptions.map((level) => (
                <Radio
                  key={level.value}
                  id={`bia_level_${level.value}`}
                  name="bia_level"
                  value={level.value}
                  checked={formData.bia_level === level.value}
                  label={level.label}
                  onChange={onRadioChange("bia_level")}
                />
              ))}
            </div>
          </div>
          
          <div>
            <Label>Subsidy Description</Label>
            <Input
              type="text"
              placeholder="e.g., 90% SkillsFuture subsidy"
              value={formData.subsidy_description}
              onChange={onInputChange("subsidy_description")}
            />
          </div>
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
          Learning Outcomes
        </h3>
        <div>
          <Label>Learning Outcomes</Label>
          <TextArea
            placeholder="Describe the key learning outcomes and objectives..."
            value={formData.learning_outcome}
            onChange={onTextAreaChange("learning_outcome")}
            rows={4}
            className="min-h-[100px]"
          />
        </div>
      </div>
    </>
  );
};