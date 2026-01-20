import React from "react";
import { ProgramInformationSection } from "./ProgramInformationSection";
import { ScheduleSection } from "./ScheduleSection";
import { ProgramTypeDetailsSection } from "./ProgramTypeDetailsSection";
import { ParticipantSection } from "./ParticipantSection";
import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { PROGRAM_TYPE_OPTIONS, BIA_LEVEL_OPTIONS, COURSE_TYPE_OPTIONS, PACE_CATEGORY_OPTIONS } from "@/utils/WorkshopAttendanceUtils/EditVisitModalUtils/workshopFormOptions";

interface WorkshopFormContentProps {
  formHook: any;
  isMobile?: boolean;
}

export const WorkshopFormContent: React.FC<WorkshopFormContentProps> = ({ 
  formHook,
  isMobile = false 
}) => {
  const { 
    formData, 
    errors, 
    handleInputChange, 
    handleSelectChange, 
    handleRadioChange,
    handleTextAreaChange 
  } = formHook;

  // Mobile Layout - Single Column
  if (isMobile) {
    return (
      <div className="space-y-6">
        <ProgramInformationSection
          formData={formData}
          errors={errors}
          programTypeOptions={PROGRAM_TYPE_OPTIONS}
          courseTypeOptions={COURSE_TYPE_OPTIONS}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onRadioChange={handleRadioChange}
        />

        <ScheduleSection
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        <ProgramTypeDetailsSection
          formData={formData}
          errors={errors}
          paceCategoryOptions={PACE_CATEGORY_OPTIONS}
          onSelectChange={handleSelectChange}
          onRadioChange={handleRadioChange}
        />

        <ParticipantSection
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        <AdditionalInfoSection
          formData={formData}
          biaLevelOptions={BIA_LEVEL_OPTIONS}
          onInputChange={handleInputChange}
          onRadioChange={handleRadioChange}
          onTextAreaChange={handleTextAreaChange}
        />
      </div>
    );
  }

  // Desktop Layout - Two Column Grid
  return (
    <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <ProgramInformationSection
            formData={formData}
            errors={errors}
            programTypeOptions={PROGRAM_TYPE_OPTIONS}
            courseTypeOptions={COURSE_TYPE_OPTIONS}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onRadioChange={handleRadioChange}
          />

          <ScheduleSection
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <ProgramTypeDetailsSection
            formData={formData}
            errors={errors}
            paceCategoryOptions={PACE_CATEGORY_OPTIONS}
            onSelectChange={handleSelectChange}
            onRadioChange={handleRadioChange}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <ParticipantSection
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

          <AdditionalInfoSection
            formData={formData}
            biaLevelOptions={BIA_LEVEL_OPTIONS}
            onInputChange={handleInputChange}
            onRadioChange={handleRadioChange}
            onTextAreaChange={handleTextAreaChange}
          />
        </div>
      </div>
    </div>
  );
};