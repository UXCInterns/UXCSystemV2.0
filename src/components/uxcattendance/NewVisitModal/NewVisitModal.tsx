"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { NewVisitFormProps } from "@/types/LearningJourneyAttendanceTypes/visit";
import { useVisitForm } from "@/hooks/learningJourney/NewVisitModal/useVisitForm";
import FormHeader from "./FormHeader";
import FormActions from "./FormActions";
import CompanyInfoSection from "./CompanyInfoSection";
import SessionDetailsSection from "./SessionDetailsSection";
import AttendanceSection from "./AttendanceSection";
import ConversionSection from "./ConversionSection";
import RevenueSection from "./RevenueSection";
import SessionCharacteristicsSection from "./SessionCharacteristicsSection";
import NotesSection from "./NotesSection";
import { SECTORS, ORGANIZATION_SIZES, INDUSTRIES } from "@/hooks/learningJourney/useOrganistationCat";

const NewVisitForm: React.FC<NewVisitFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const {
    formData,
    errors,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleTextAreaChange,
    handleRadioChange,
    validateForm,
    processFormDataForSubmission,
    resetForm,
  } = useVisitForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const processedData = processFormDataForSubmission(formData);
      onSubmit(processedData);
      resetForm();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <FormHeader />

        <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <CompanyInfoSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                sectors={SECTORS}
                industries={INDUSTRIES}
                organizationSizes={ORGANIZATION_SIZES}
              />

              <SessionDetailsSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <AttendanceSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />

              <ConversionSection
                formData={formData}
                onRadioChange={handleRadioChange}
              />

              <RevenueSection
                formData={formData}
                onInputChange={handleInputChange}
              />

              <SessionCharacteristicsSection
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          </div>

          {/* Notes - Full Width */}
          <div className="pt-4">
            <NotesSection
              formData={formData}
              onTextAreaChange={handleTextAreaChange}
            />
          </div>
        </div>

        <FormActions onCancel={onClose} />
      </form>
    </Modal>
  );
};

export default NewVisitForm;