"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { useNewWorkshopForm } from "@/hooks/workshop/NewVisitModal/useNewWorkshopForm";
import { useFormSubmission } from "@/hooks/workshop/NewVisitModal/useFormSubmission";
import { WorkshopFormHeader } from "./WorkshopFormHeader";
import { WorkshopFormContent } from "./WorkshopFormContent";
import { FormActions } from "./FormActions";
import { ErrorModal } from "./ErrorModal";
import { SuccessNotification } from "./SuccessNotification";
import { NewWorkshopFormProps } from "@/types/workshop";

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
      } catch (error: any) {
        submissionHook.handleError(error);
      } finally {
        submissionHook.setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
        <form onSubmit={handleFormSubmit} className="p-6 space-y-6 flex flex-col h-full">
          <WorkshopFormHeader />
          <WorkshopFormContent formHook={formHook} />
          <FormActions 
            isSubmitting={submissionHook.isSubmitting} 
            onCancel={onClose} 
          />
        </form>
      </Modal>

      <ErrorModal
        isOpen={submissionHook.showErrorModal}
        errorMessage={submissionHook.errorMessage}
        onClose={submissionHook.closeErrorModal}
      />

      <SuccessNotification
        show={submissionHook.showNotification}
        message={submissionHook.notificationMessage}
        onClose={submissionHook.closeNotification}
      />
    </>
  );
};

export default NewWorkshopForm;