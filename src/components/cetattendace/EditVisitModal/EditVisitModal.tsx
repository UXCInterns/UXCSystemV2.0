"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { X } from "lucide-react";
import { EditWorkshopFormProps } from "@/types/WorkshopTypes/workshop";
import { useWorkshopForm } from "@/hooks/workshop/EditVisitModal/useWorkshopForm";
import { PROGRAM_TYPE_OPTIONS, BIA_LEVEL_OPTIONS, COURSE_TYPE_OPTIONS, PACE_CATEGORY_OPTIONS,} from "@/utils/WorkshopAttendanceUtils/EditVisitModalUtils/workshopFormOptions";
import { FormHeader } from "./FormHeader";
import { FormContent } from "./FormContent";
import { FormActions } from "./FormActions";

const EditWorkshopForm: React.FC<EditWorkshopFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workshop,
}) => {
  const {
    formData,
    errors,
    handleInputChange,
    handleSelectChange,
    handleTextAreaChange,
    handleRadioChange,
    handleBiaLevelChange,
    validateForm,
  } = useWorkshopForm(isOpen, workshop);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const individualGroupParticipants = Math.max(
        0,
        formData.no_of_participants - formData.company_sponsored_participants
      );
      
      const submitData = {
        ...formData,
        individual_group_participants: individualGroupParticipants,
      };
      
      onSubmit(submitData);
      onClose();
    }
  };

  if (!workshop || !isOpen) {
    return null;
  }

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
                    Edit Workshop
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Update the details for this workshop
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
              key={`edit-${workshop.id}-${isOpen}`} 
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-4"
            >
              <div className="space-y-6">
                <FormContent
                  formData={formData}
                  errors={errors}
                  programTypeOptions={PROGRAM_TYPE_OPTIONS}
                  courseTypeOptions={COURSE_TYPE_OPTIONS}
                  paceCategoryOptions={PACE_CATEGORY_OPTIONS}
                  biaLevelOptions={BIA_LEVEL_OPTIONS}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                  onTextAreaChange={handleTextAreaChange}
                  onRadioChange={handleRadioChange}
                  onBiaLevelChange={handleBiaLevelChange}
                  isMobile={true}
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
          <form 
            key={`edit-${workshop.id}-${isOpen}`} 
            onSubmit={handleSubmit} 
            className="p-6 space-y-6"
          >
            <FormHeader />

            <FormContent
              formData={formData}
              errors={errors}
              programTypeOptions={PROGRAM_TYPE_OPTIONS}
              courseTypeOptions={COURSE_TYPE_OPTIONS}
              paceCategoryOptions={PACE_CATEGORY_OPTIONS}
              biaLevelOptions={BIA_LEVEL_OPTIONS}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onTextAreaChange={handleTextAreaChange}
              onRadioChange={handleRadioChange}
              onBiaLevelChange={handleBiaLevelChange}
              isMobile={false}
            />

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

export default EditWorkshopForm;