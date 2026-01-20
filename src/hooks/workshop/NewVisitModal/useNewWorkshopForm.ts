import { useState, useEffect } from "react";
import { NewWorkshopFormData } from "@/types/WorkshopTypes/workshop";

const INITIAL_FORM_DATA: NewWorkshopFormData = {
  program_type: "",
  school_dept: "",
  course_program_title: "",
  program_start_date: "",
  program_end_date: "",
  course_hours: 0,
  no_of_participants: 1,
  company_sponsored_participants: 0,
  trainee_hours: 0,
  run_number: "",
  individual_group_participants: 0,
  course_type: "",
  subsidy_description: "",
  bia_level: "",
  learning_outcome: "",
  category: "",
  csc: false,
};

export const useNewWorkshopForm = (isOpen: boolean) => {
  const [formData, setFormData] = useState<NewWorkshopFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
    }
  }, [isOpen]);

  // Auto-calculate trainee hours
  useEffect(() => {
    const totalTraineeHours = formData.no_of_participants * formData.course_hours;
    setFormData(prev => ({ ...prev, trainee_hours: totalTraineeHours }));
  }, [formData.no_of_participants, formData.course_hours]);

  // Auto-calculate individual participants
  useEffect(() => {
    const individualParticipants = formData.no_of_participants - formData.company_sponsored_participants;
    setFormData(prev => ({ 
      ...prev, 
      individual_group_participants: Math.max(0, individualParticipants)
    }));
  }, [formData.no_of_participants, formData.company_sponsored_participants]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleRadioChange = (field: string) => (value: string) => {
    if (field === "csc") {
      setFormData(prev => ({ ...prev, [field]: value === "yes" }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleTextAreaChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.program_type) newErrors.program_type = "Program type is required";
    if (!formData.school_dept.trim()) newErrors.school_dept = "School/Department is required";
    if (!formData.course_program_title.trim()) newErrors.course_program_title = "Course title is required";
    if (!formData.program_start_date) newErrors.program_start_date = "Start date is required";
    if (!formData.program_end_date) newErrors.program_end_date = "End date is required";
    if (formData.course_hours <= 0) newErrors.course_hours = "Course hours must be greater than 0";
    if (formData.no_of_participants < 1) newErrors.no_of_participants = "Number of participants must be at least 1";
    if (formData.company_sponsored_participants < 0) newErrors.company_sponsored_participants = "Cannot be negative";
    if (formData.company_sponsored_participants > formData.no_of_participants) {
      newErrors.company_sponsored_participants = "Cannot exceed total participants";
    }

    // Validate date order
    if (formData.program_start_date && formData.program_end_date) {
      const startDate = new Date(formData.program_start_date);
      const endDate = new Date(formData.program_end_date);
      if (endDate < startDate) {
        newErrors.program_end_date = "End date must be after start date";
      }
    }

    // Program-specific validations
    if (formData.program_type === "pace" && !formData.category) {
      newErrors.category = "Category is required for PACE workshops";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleSelectChange,
    handleRadioChange,
    handleTextAreaChange,
    validateForm,
    resetForm,
  };
};