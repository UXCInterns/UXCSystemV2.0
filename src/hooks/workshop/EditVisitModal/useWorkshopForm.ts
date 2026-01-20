import { useState, useEffect } from "react";
import { Workshop, WorkshopFormData } from "@/types/WorkshopTypes/workshop";

const INITIAL_FORM_DATA: WorkshopFormData = {
  id: "",
  program_type: "pace",
  school_dept: "",
  course_program_title: "",
  program_start_date: "",
  program_end_date: "",
  course_hours: 0,
  no_of_participants: 0,
  company_sponsored_participants: 0,
  individual_group_participants: 0,
  trainee_hours: 0,
  run_number: "",
  course_type: "",
  subsidy_description: "",
  bia_level: "",
  learning_outcome: "",
  category: "",
  csc: false,
};

export const useWorkshopForm = (
  isOpen: boolean,
  workshop: Workshop | null | undefined
) => {
  const [formData, setFormData] = useState<WorkshopFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form data when modal state changes
  useEffect(() => {
    if (isOpen && workshop) {
      setFormData({
        id: workshop.id,
        program_type: workshop.program_type,
        school_dept: workshop.school_dept,
        course_program_title: workshop.course_program_title,
        program_start_date: workshop.program_start_date,
        program_end_date: workshop.program_end_date,
        course_hours: workshop.course_hours,
        no_of_participants: workshop.no_of_participants,
        company_sponsored_participants: workshop.company_sponsored_participants,
        individual_group_participants: workshop.individual_group_participants || 0,
        trainee_hours: workshop.trainee_hours,
        run_number: workshop.run_number || "",
        course_type: workshop.course_type || "",
        subsidy_description: workshop.subsidy_description || "",
        bia_level: workshop.bia_level || "",
        learning_outcome: workshop.learning_outcome || "",
        category: workshop.category || "",
        csc: workshop.csc || false,
      });
      setErrors({});
    } else if (!isOpen) {
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
    }
  }, [isOpen, workshop]);

  // Auto-calculate trainee hours
  useEffect(() => {
    const totalParticipants = formData.no_of_participants;
    const courseHours = formData.course_hours;
    if (totalParticipants > 0 && courseHours > 0) {
      setFormData(prev => ({ 
        ...prev, 
        trainee_hours: totalParticipants * courseHours 
      }));
    }
  }, [formData.no_of_participants, formData.course_hours]);

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

  const handleTextAreaChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRadioChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value === "yes" }));
  };

  const handleBiaLevelChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      bia_level: value === "none" ? "" : value 
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.course_program_title.trim()) {
      newErrors.course_program_title = "Program title is required";
    }
    if (!formData.school_dept) {
      newErrors.school_dept = "School/Department is required";
    }
    if (!formData.program_start_date) {
      newErrors.program_start_date = "Start date is required";
    }
    if (!formData.program_end_date) {
      newErrors.program_end_date = "End date is required";
    }
    if (formData.course_hours <= 0) {
      newErrors.course_hours = "Course hours must be greater than 0";
    }
    if (formData.no_of_participants < 0) {
      newErrors.no_of_participants = "Must be 0 or greater";
    }
    if (formData.company_sponsored_participants < 0) {
      newErrors.company_sponsored_participants = "Must be 0 or greater";
    }
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

    // PACE-specific validation
    if (formData.program_type === "pace" && !formData.category) {
      newErrors.category = "Category is required for PACE workshops";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleSelectChange,
    handleTextAreaChange,
    handleRadioChange,
    handleBiaLevelChange,
    validateForm,
  };
};