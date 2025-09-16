"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/index";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { SECTORS, ORGANIZATION_SIZES, INDUSTRIES, SESSION_TYPES } from "@/hooks/learningJourney/useOrganistationCat";

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

interface EditVisitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (visitData: any) => void;
  visit?: Visit | null; // Add visit prop for editing
}

const EditVisitForm: React.FC<EditVisitFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  visit,
}) => {
  const [formData, setFormData] = useState({
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // FIXED: Reset form data when modal closes or visit changes
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
      setErrors({}); // Clear any existing errors
    } else if (!isOpen) {
      // Reset form data when modal closes
      setFormData({
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
      });
      setErrors({});
    }
  }, [isOpen, visit]); // FIXED: Use both isOpen and visit as dependencies

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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user makes a selection
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

    // Validate time order
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  // FIXED: Don't render the form if there's no visit data
  if (!visit) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
      <form key={`edit-${visit.id}-${isOpen}`} onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Visit
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update the details for this company visit
          </p>
        </div>

        <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Company Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label>Company Name *</Label>
                    <Input
                      type="text"
                      placeholder="Enter company name"
                      value={formData.company_name}
                      onChange={handleInputChange("company_name")}
                      error={!!errors.company_name}
                      hint={errors.company_name}
                    />
                  </div>
                  <div>
                    <Label>UEN Number</Label>
                    <Input
                      type="text"
                      placeholder="e.g., 123456789A"
                      value={formData.uen_number}
                      onChange={handleInputChange("uen_number")}
                      className="font-mono"
                    />
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Select
                      placeholder="Select industry"
                      value={formData.industry}
                      onChange={handleSelectChange("industry")}
                      options={INDUSTRIES.map(industry => ({
                        value: industry,
                        label: industry
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Sector</Label>
                    <Select
                      placeholder="Select sector"
                      value={formData.sector}
                      onChange={handleSelectChange("sector")}
                      options={SECTORS.map(sector => ({
                        value: sector,
                        label: sector
                      }))}
                    />
                  </div>
                  <div>
                    <Label>Company Size</Label>
                    <Select
                      placeholder="Select company size"
                      value={formData.size}
                      onChange={handleSelectChange("size")}
                      options={ORGANIZATION_SIZES.map(size => ({
                        value: size,
                        label: size
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Session Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label>Date of Visit *</Label>
                    <Input
                      type="date"
                      value={formData.date_of_visit}
                      onChange={handleInputChange("date_of_visit")}
                      error={!!errors.date_of_visit}
                      hint={errors.date_of_visit}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Start Time *</Label>
                      <Input
                        type="time"
                        value={formData.start_time}
                        onChange={handleInputChange("start_time")}
                        error={!!errors.start_time}
                        hint={errors.start_time}
                      />
                    </div>
                    <div>
                      <Label>End Time *</Label>
                      <Input
                        type="time"
                        value={formData.end_time}
                        onChange={handleInputChange("end_time")}
                        error={!!errors.end_time}
                        hint={errors.end_time}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Attendance Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Attendance Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label>Total Registered *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.total_registered ?? ""}
                      onChange={handleInputChange("total_registered")}
                      min="0"
                      error={!!errors.total_registered}
                      hint={errors.total_registered}
                    />
                  </div>
                  <div>
                    <Label>Total Attended *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.total_attended ?? ""}
                      onChange={handleInputChange("total_attended")}
                      min="0"
                      error={!!errors.total_attended}
                      hint={errors.total_attended}
                    />
                  </div>
                </div>
              </div>

              {/* Conversion Outcomes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Conversion Outcomes
                </h3>
                <div className="flex space-x-6">
                  <div className="flex-1 space-y-3 border-r border-gray-300 dark:border-gray-800 h-full">
                    <Label>Consultancy Conversion</Label>
                      <Radio
                        id="consultancy-yes"
                        name="consultancy"
                        value="yes"
                        checked={formData.consultancy}
                        label="Yes"
                        onChange={handleRadioChange("consultancy")}
                      />
                      <Radio
                        id="consultancy-no"
                        name="consultancy"
                        value="no"
                        checked={!formData.consultancy}
                        label="No"
                        onChange={handleRadioChange("consultancy")}
                      />
                  </div>

                  <div className="flex-1 space-y-3">
                    <Label>Training Conversion</Label>
                      <Radio
                        id="training-yes"
                        name="training"
                        value="yes"
                        checked={formData.training}
                        label="Yes"
                        onChange={handleRadioChange("training")}
                      />
                      <Radio
                        id="training-no"
                        name="training"
                        value="no"
                        checked={!formData.training}
                        label="No"
                        onChange={handleRadioChange("training")}
                      />
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Financial Impact
                </h3>
                <div>
                  <Label>Revenue Generated (SGD)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.revenue ?? ""}
                    onChange={handleInputChange("revenue")}
                    min="0"
                    step={0.01}
                  />
                </div>
              </div>

              {/* Session Characteristics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Session Characteristics
                </h3>
                <div className="space-y-3">
                  <Label>Type of Session</Label>
                  <div className="space-y-3">
                    <Radio
                      id="pace-program"
                      name="session-characteristic"
                      value="pace"
                      checked={formData.pace && !formData.informal}
                      label="PACE Program"
                      onChange={() => setFormData(prev => ({ ...prev, pace: true, informal: false }))}
                    />
                    <Radio
                      id="informal-session"
                      name="session-characteristic"
                      value="informal"
                      checked={formData.informal && !formData.pace}
                      label="Informal Session"
                      onChange={() => setFormData(prev => ({ ...prev, informal: true, pace: false }))}
                    />
                    <Radio
                      id="neither-session"
                      name="session-characteristic"
                      value="neither"
                      checked={!formData.pace && !formData.informal}
                      label="Neither"
                      onChange={() => setFormData(prev => ({ ...prev, pace: false, informal: false }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes - Full Width */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 pt-4  ">
              Additional Information
            </h3>
            <div>
              <Label>Visit Notes</Label>
              <TextArea
                placeholder="Enter any additional notes about the visit..."
                value={formData.notes}
                onChange={handleTextAreaChange("notes")}
                rows={4}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            >
              Update Visit
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditVisitForm;