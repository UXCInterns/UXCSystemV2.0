import { useState, useEffect } from "react";
import { VisitFormData, FormErrors } from "@/types/LearningJourneyAttendanceTypes/visit";

const initialFormData: VisitFormData = {
  company_name: "",
  uen_number: "",
  industry: "",
  sector: "",
  size: "",
  date_of_visit: "",
  start_time: "",
  end_time: "",
  duration: "",
  session_type: "",
  total_registered: 0,
  total_attended: 0,
  consultancy: false,
  training: false,
  revenue: 0,
  pace: false,
  informal: false,
  notes: "",
};

export const useVisitForm = () => {
  const [formData, setFormData] = useState<VisitFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  // Auto-calculate session type based on start time
  useEffect(() => {
    if (formData.start_time) {
      const [hours] = formData.start_time.split(':').map(Number);
      const sessionType = hours < 12 ? 'AM' : 'PM';
      setFormData(prev => ({ ...prev, session_type: sessionType }));
    }
  }, [formData.start_time]);

  // Auto-calculate duration when start_time or end_time changes
  useEffect(() => {
    if (formData.start_time && formData.end_time) {
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(`2000-01-01T${formData.end_time}`);
      
      if (endTime > startTime) {
        const diffMs = endTime.getTime() - startTime.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        let durationStr = "";
        if (diffHours > 0) {
          durationStr += `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
        }
        if (diffMinutes > 0) {
          if (durationStr) durationStr += " ";
          durationStr += `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
        }
        
        setFormData(prev => ({ ...prev, duration: durationStr || "0 minutes" }));
      }
    }
  }, [formData.start_time, formData.end_time]);

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

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.company_name.trim()) newErrors.company_name = "Company name is required";
    if (!formData.date_of_visit) newErrors.date_of_visit = "Visit date is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    if (formData.total_registered < 0) newErrors.total_registered = "Must be 0 or greater";
    if (formData.total_attended < 0) newErrors.total_attended = "Must be 0 or greater";
    if (formData.total_attended > formData.total_registered) {
      newErrors.total_attended = "Cannot exceed total registered";
    }

    if (formData.start_time && formData.end_time) {
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(`2000-01-01T${formData.end_time}`);
      if (endTime <= startTime) {
        newErrors.end_time = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processFormDataForSubmission = (data: VisitFormData) => {
    const processedData = { ...data };
    
    Object.keys(processedData).forEach(key => {
      const value = processedData[key as keyof VisitFormData];
      if (typeof value === 'string' && value.trim() === '') {
        (processedData as any)[key] = null;
      }
    });
    
    return processedData;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
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
  };
};