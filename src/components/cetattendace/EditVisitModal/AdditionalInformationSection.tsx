import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import { WorkshopFormData } from "@/types/WorkshopTypes/workshop";

interface AdditionalInformationSectionProps {
  formData: WorkshopFormData;
  biaLevelOptions: Array<{ value: string; label: string }>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBiaLevelChange: (value: string) => void;
}

export const AdditionalInformationSection: React.FC<AdditionalInformationSectionProps> = ({
  formData,
  biaLevelOptions,
  onInputChange,
  onBiaLevelChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Additional Information
      </h3>
      <div className="space-y-3">
        <div>
          <Label>BIA Level</Label>
          <div className="grid grid-cols-2 gap-3 mt-2 sm:flex sm:space-x-4 sm:gap-0">
            {biaLevelOptions.map((level) => (
              <Radio
                key={level.value}
                id={`bia-${level.value.toLowerCase()}`}
                name="bia-level"
                value={level.value.toLowerCase()}
                checked={formData.bia_level?.toLowerCase() === level.value.toLowerCase()}
                label={level.label}
                onChange={() => onBiaLevelChange(level.value.toLowerCase())}
              />
            ))}
            <Radio
              id="bia-none"
              name="bia-level"
              value="none"
              checked={!formData.bia_level || formData.bia_level === "Not specified"}
              label="None"
              onChange={() => onBiaLevelChange("none")}
            />
          </div>
        </div>
        <div>
          <Label>Subsidy Description</Label>
          <Input
            type="text"
            placeholder="e.g., SkillsFuture, UTAP, Company funded"
            value={formData.subsidy_description}
            onChange={onInputChange("subsidy_description")}
          />
        </div>
      </div>
    </div>
  );
};