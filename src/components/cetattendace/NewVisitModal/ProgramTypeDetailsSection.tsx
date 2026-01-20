import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Select from "@/components/form/Select";
import { NewWorkshopFormData } from "@/types/WorkshopTypes/workshop";

interface ProgramTypeDetailsSectionProps {
  formData: NewWorkshopFormData;
  errors: Record<string, string>;
  paceCategoryOptions: Array<{ value: string; label: string }>;
  onSelectChange: (field: string) => (value: string) => void;
  onRadioChange: (field: string) => (value: string) => void;
}

export const ProgramTypeDetailsSection: React.FC<ProgramTypeDetailsSectionProps> = ({
  formData,
  errors,
  paceCategoryOptions,
  onSelectChange,
  onRadioChange,
}) => {
  if (!formData.program_type) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        {formData.program_type === "pace" ? "PACE Program Details" : "NON-PACE Program Details"}
      </h3>
      <div className="space-y-3">
        {formData.program_type === "pace" ? (
          <div>
            <Label>Category *</Label>
            <Select
              placeholder="Select PACE category"
              value={formData.category}
              onChange={onSelectChange("category")}
              options={paceCategoryOptions}
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};