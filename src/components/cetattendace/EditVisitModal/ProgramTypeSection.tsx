import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Select from "@/components/form/Select";
import { WorkshopFormData } from "@/types/WorkshopTypes/workshop";

interface ProgramTypeSectionProps {
  programType: string;
  formData: WorkshopFormData;
  errors: Record<string, string>;
  paceCategoryOptions: Array<{ value: string; label: string }>;
  onSelectChange: (field: string) => (value: string) => void;
  onRadioChange: (field: string) => (value: string) => void;
}

export const ProgramTypeSection: React.FC<ProgramTypeSectionProps> = ({
  programType,
  formData,
  errors,
  paceCategoryOptions,
  onSelectChange,
  onRadioChange,
}) => {
  if (programType === "pace") {
    return (
      <div className="space-y-4">
        <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
          PACE Program Details
        </h3>
        <div className="space-y-3">
          <div>
            <Label>Category *</Label>
            <Select
              placeholder="Select PACE category"
              value={formData.category}
              onChange={onSelectChange("category")}
              options={paceCategoryOptions}
            />
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (programType === "non_pace") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
          Non-PACE Program Details
        </h3>
        <div className="space-y-3">
          <Label>CSC Eligible</Label>
          <div className="flex space-x-6">
            <Radio
              id="csc-yes"
              name="csc"
              value="yes"
              checked={formData.csc}
              label="Yes"
              onChange={onRadioChange("csc")}
            />
            <Radio
              id="csc-no"
              name="csc"
              value="no"
              checked={!formData.csc}
              label="No"
              onChange={onRadioChange("csc")}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};