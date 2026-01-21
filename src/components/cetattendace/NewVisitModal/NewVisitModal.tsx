"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { X } from "lucide-react";
import { useNewWorkshopForm } from "@/hooks/workshop/NewVisitModal/useNewWorkshopForm";
import { useFormSubmission } from "@/hooks/workshop/NewVisitModal/useFormSubmission";
import { WorkshopFormHeader } from "./WorkshopFormHeader";
import { WorkshopFormContent } from "./WorkshopFormContent";
import { FormActions } from "./FormActions";
import { ErrorModal } from "./ErrorModal";
import { NewWorkshopFormProps } from "@/types/WorkshopTypes/workshop";

const NewWorkshopForm: React.FC<NewWorkshopFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const formHook = useNewWorkshopForm(isOpen);
  const submissionHook = useFormSubmission();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formHook.validateForm()) {
      submissionHook.setIsSubmitting(true);
      
      try {
        await onSubmit(formHook.formData);
        formHook.resetForm();
        submissionHook.handleSuccess();
        onClose();
      } catch (error) {
        submissionHook.handleError(error as Error) ;
      } finally {
        submissionHook.setIsSubmitting(false);
      }
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
            <div className="px-4 py-4 sticky top-0 z-10">
              <div className="flex items-center justify-between mb-3">
                <WorkshopFormHeader />
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
              onSubmit={handleFormSubmit}
              className="flex-1 overflow-y-auto p-4"
            >
              <div className="space-y-6">
                <WorkshopFormContent formHook={formHook} isMobile={true} />
              </div>

              {/* Mobile Form Actions */}
              <div>
                <FormActions 
                  isSubmitting={submissionHook.isSubmitting} 
                  onCancel={onClose} 
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Desktop Modal - Hidden on mobile */}
      <div className="hidden md:block">
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
          <form onSubmit={handleFormSubmit} className="p-6 space-y-6 flex flex-col h-full">
            <WorkshopFormHeader />
            <WorkshopFormContent formHook={formHook} isMobile={false} />
            <FormActions 
              isSubmitting={submissionHook.isSubmitting} 
              onCancel={onClose} 
            />
          </form>
        </Modal>
      </div>

      <ErrorModal
        isOpen={submissionHook.showErrorModal}
        errorMessage={submissionHook.errorMessage}
        onClose={submissionHook.closeErrorModal}
      />

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

export default NewWorkshopForm;