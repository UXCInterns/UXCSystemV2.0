"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { X } from "lucide-react";
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

  if (!visit || !isOpen) return null;

  return (
    <>
      {/* Mobile Full-Screen Modal */}
      <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="absolute inset-0 flex items-end">
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl max-h-[90vh] flex flex-col animate-slideUp shadow-2xl">
            {/* Mobile Header */}
            <div className="px-4 py-4 border-b border-gray-200 dark:border-white/[0.05] bg-white dark:bg-gray-900 rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Edit Visit
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Update the details for this company visit
                  </p>
                </div>
                <button
                  onClick={onClose}
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Content */}
            <form 
              key={`edit-${visit.id}-${isOpen}`} 
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-4"
            >
              <div className="space-y-6">
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
                <NotesSection
                  formData={formData}
                  onTextAreaChange={handleTextAreaChange}
                />
              </div>

              {/* Mobile Form Actions */}
              <div>
                <FormActions 
                  onCancel={onClose}
                  submitLabel="Update Visit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop Modal - Hidden on mobile */}
      <div className="hidden md:block">
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
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default EditVisitForm;