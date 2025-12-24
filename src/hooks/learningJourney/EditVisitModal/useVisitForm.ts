import { useState, useEffect } from "react";

interface Visit {
  id: string;
  company_name: string;
  date_of_visit: string;
  total_attended: number;
  total_registered: number;
  uen_number: string;
  start_time: string;
  end_time: string;
  duration: string;
  session_type: string;
  consultancy: boolean;
  training: boolean;
  revenue: number;
  sector: string;
  size: string;
  industry: string;
  notes: string;
  pace: boolean;
  informal: boolean;
  created_at: string;
  updated_at: string;
}

const initialFormState = {
  id: "",
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

export const useVisitForm = (isOpen: boolean, visit?: Visit | null) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or populate form data
  useEffect(() => {
    if (isOpen && visit) {
      setFormData({
        id: visit.id,
        company_name: visit.company_name,
        uen_number: visit.uen_number === "-" ? "" : visit.uen_number,
        industry: visit.industry === "-" ? "" : visit.industry,
        sector: visit.sector === "-" ? "" : visit.sector,
        size: visit.size === "-" ? "" : visit.size,
        date_of_visit: visit.date_of_visit,
        start_time: visit.start_time,
        end_time: visit.end_time,
        duration: visit.duration === "-" ? "" : visit.duration,
        session_type: visit.session_type === "-" ? "" : visit.session_type,
        total_registered: visit.total_registered,
        total_attended: visit.total_attended,
        consultancy: visit.consultancy,
        training: visit.training,
        revenue: visit.revenue,
        pace: visit.pace,
        informal: visit.informal,
        notes: visit.notes,
      });
      setErrors({});
    } else if (!isOpen) {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [isOpen, visit]);

  // Auto-calculate duration
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

  const handleSessionTypeChange = (type: 'pace' | 'informal' | 'neither') => {
    switch (type) {
      case 'pace':
        setFormData(prev => ({ ...prev, pace: true, informal: false }));
        break;
      case 'informal':
        setFormData(prev => ({ ...prev, informal: true, pace: false }));
        break;
      case 'neither':
        setFormData(prev => ({ ...prev, pace: false, informal: false }));
        break;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

  return {
    formData,
    errors,
    handleInputChange,
    handleSelectChange,
    handleTextAreaChange,
    handleRadioChange,
    handleSessionTypeChange,
    validateForm,
  };
};