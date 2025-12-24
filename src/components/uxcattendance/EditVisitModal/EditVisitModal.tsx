"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { useVisitForm } from "@/hooks/learningJourney/EditVisitModal/useVisitForm";
import FormHeader from "./FormHeader";
import FormLayout from "./FormLayout";
import FormActions from "./FormActions";
import CompanyInformationSection from "./CompanyInformationSection";
import SessionDetailsSection from "./SessionDetailsSection";
import AttendanceSection from "./AttendanceSection";
import ConversionOutcomesSection from "./ConversionOutcomesSection";
import RevenueSection from "./RevenueSection";
import SessionCharacteristicsSection from "./SessionCharacteristicsSection";
import NotesSection from "./NotesSection";
import { EditVisitFormProps } from "@/types/LearningJourneyAttendanceTypes/visit";

const EditVisitForm: React.FC<EditVisitFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  visit,
}) => {
  const {
    formData,
    errors,
    handleInputChange,
    handleSelectChange,
    handleTextAreaChange,
    handleRadioChange,
    handleSessionTypeChange,
    validateForm,
  } = useVisitForm(isOpen, visit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!visit) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
      <form key={`edit-${visit.id}-${isOpen}`} onSubmit={handleSubmit} className="p-6 space-y-6">
        <FormHeader 
          title="Edit Visit"
          description="Update the details for this company visit"
        />

        <FormLayout
          leftColumn={
            <>
              <CompanyInformationSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
              />
              <SessionDetailsSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />
            </>
          }
          rightColumn={
            <>
              <AttendanceSection
                formData={formData}
                errors={errors}
                onInputChange={handleInputChange}
              />
              <ConversionOutcomesSection
                formData={formData}
                onRadioChange={handleRadioChange}
              />
              <RevenueSection
                formData={formData}
                onInputChange={handleInputChange}
              />
              <SessionCharacteristicsSection
                formData={formData}
                onSessionTypeChange={handleSessionTypeChange}
              />
            </>
          }
          fullWidth={
            <NotesSection
              formData={formData}
              onTextAreaChange={handleTextAreaChange}
            />
          }
        />

        <FormActions 
          onCancel={onClose}
          submitLabel="Update Visit"
        />
      </form>
    </Modal>
  );
};

export default EditVisitForm;