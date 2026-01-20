import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { NewWorkshopFormData } from "@/types/WorkshopTypes/workshop";

interface ProgramInformationSectionProps {
  formData: NewWorkshopFormData;
  errors: Record<string, string>;
  programTypeOptions: Array<{ value: string; label: string }>;
  courseTypeOptions: Array<{ value: string; label: string }>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string) => (value: string) => void;
  onRadioChange: (field: string) => (value: string) => void;
}

export const ProgramInformationSection: React.FC<ProgramInformationSectionProps> = ({
  formData,
  errors,
  programTypeOptions,
  courseTypeOptions,
  onInputChange,
  onSelectChange,
  onRadioChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Program Information
      </h3>
      <div className="space-y-3">
        {/* Program Type */}
        <div>
          <Label>Program Type *</Label>
          <div className="flex space-x-6 mt-2">
            {programTypeOptions.map((type) => (
              <Radio
                key={type.value}
                id={`program_type_${type.value}`}
                name="program_type"
                value={type.value}
                checked={formData.program_type === type.value}
                label={type.label}
                onChange={onRadioChange("program_type")}
              />
            ))}
          </div>
          {errors.program_type && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.program_type}</p>
          )}
        </div>
        
        <div>
          <Label>School/Department *</Label>
          <Input
            type="text"
            placeholder="Enter school or department name"
            value={formData.school_dept}
            onChange={onInputChange("school_dept")}
            error={!!errors.school_dept}
            hint={errors.school_dept}
          />
        </div>

        <div>
          <Label>Course/Program Title *</Label>
          <Input
            type="text"
            placeholder="Enter course title"
            value={formData.course_program_title}
            onChange={onInputChange("course_program_title")}
            error={!!errors.course_program_title}
            hint={errors.course_program_title}
          />
        </div>

        <div>
          <Label>Course Type</Label>
          <Select
            placeholder="Select course type"
            value={formData.course_type}
            onChange={onSelectChange("course_type")}
            options={courseTypeOptions}
          />
        </div>

        <div>
          <Label>Run Number</Label>
          <Input
            type="text"
            placeholder="e.g., Run 1, R001"
            value={formData.run_number}
            onChange={onInputChange("run_number")}
          />
        </div>
      </div>
    </div>
  );
};