"use client";

import React from "react";
import { Modal } from "@/components/ui/modal/index";
import { EditWorkshopFormProps } from "@/types/workshop";
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

  if (!workshop) {
    return null;
  }

  return (
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
        />

        <FormActions onCancel={onClose} />
      </form>
    </Modal>
  );
};

export default EditWorkshopForm;