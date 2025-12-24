import React from "react";
import { WorkshopFormData } from "@/types/workshop";
import { ProgramInformationSection } from "./ProgramInformationSection";
import { ProgramTypeSection } from "./ProgramTypeSection";
import { ScheduleSection } from "./ScheduleSection";
import { ParticipantSection } from "./ParticipantSection";
import { AdditionalInformationSection } from "./AdditionalInformationSection";
import { LearningOutcomesSection } from "./LearningOutcomesSection";

interface FormContentProps {
  formData: WorkshopFormData;
  errors: Record<string, string>;
  programTypeOptions: Array<{ value: string; label: string }>;
  courseTypeOptions: Array<{ value: string; label: string }>;
  paceCategoryOptions: Array<{ value: string; label: string }>;
  biaLevelOptions: Array<{ value: string; label: string }>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string) => (value: string) => void;
  onTextAreaChange: (field: string) => (value: string) => void;
  onRadioChange: (field: string) => (value: string) => void;
  onBiaLevelChange: (value: string) => void;
}

export const FormContent: React.FC<FormContentProps> = ({
  formData,
  errors,
  programTypeOptions,
  courseTypeOptions,
  paceCategoryOptions,
  biaLevelOptions,
  onInputChange,
  onSelectChange,
  onTextAreaChange,
  onRadioChange,
  onBiaLevelChange,
}) => {
  return (
    <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <ProgramInformationSection
            formData={formData}
            errors={errors}
            programTypeOptions={programTypeOptions}
            courseTypeOptions={courseTypeOptions}
            onInputChange={onInputChange}
            onSelectChange={onSelectChange}
          />

          <ProgramTypeSection
            programType={formData.program_type}
            formData={formData}
            errors={errors}
            paceCategoryOptions={paceCategoryOptions}
            onSelectChange={onSelectChange}
            onRadioChange={onRadioChange}
          />

          <ScheduleSection
            formData={formData}
            errors={errors}
            onInputChange={onInputChange}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ParticipantSection
            formData={formData}
            errors={errors}
            onInputChange={onInputChange}
          />

          <AdditionalInformationSection
            formData={formData}
            biaLevelOptions={biaLevelOptions}
            onInputChange={onInputChange}
            onBiaLevelChange={onBiaLevelChange}
          />

          <LearningOutcomesSection
            value={formData.learning_outcome}
            onChange={onTextAreaChange}
          />
        </div>
      </div>
    </div>
  );
};