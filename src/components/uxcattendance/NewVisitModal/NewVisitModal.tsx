"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { X } from "lucide-react";
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

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Full-Screen Modal */}
      <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="absolute inset-0 flex items-end">
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl max-h-[90vh] flex flex-col animate-slideUp shadow-2xl">
            {/* Mobile Header */}
            <div className="px-4 py-4 dark:border-white/[0.05] bg-white dark:bg-gray-900 rounded-t-3xl sticky top-0 z-10">
              <div className="flex items-center justify-between mb-3">
                <FormHeader />
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
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-4"
            >
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

                <NotesSection
                  formData={formData}
                  onTextAreaChange={handleTextAreaChange}
                />
              </div>

              {/* Mobile Form Actions */}
              <div>
                <FormActions onCancel={onClose} />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop Modal - Hidden on mobile */}
      <div className="hidden md:block">
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

export default NewVisitForm;