"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/index";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { PROGRAM_TYPES, COURSE_TYPES, BIA_LEVELS, PACE_CATEGORIES } from "@/hooks/workshop/useWorkshopOptions";

interface NewWorkshopFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workshopData: any) => void;
}

// Transform constants to match form requirements
const PROGRAM_TYPE_OPTIONS = PROGRAM_TYPES.map(type => ({
  value: type.toLowerCase().replace("-", "_"),
  label: type
}));

const BIA_LEVEL_OPTIONS = BIA_LEVELS.map(level => ({
  value: level,
  label: level
}));

const COURSE_TYPE_OPTIONS = COURSE_TYPES.map(type => ({
  value: type,
  label: type
}));

const PACE_CATEGORY_OPTIONS = PACE_CATEGORIES.map(category => ({
  value: category,
  label: category
}));

const NewWorkshopForm: React.FC<NewWorkshopFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    program_type: "",
    school_dept: "",
    course_program_title: "",
    program_start_date: "",
    program_end_date: "",
    course_hours: 0,
    no_of_participants: 1, // Default to 1 instead of 0
    company_sponsored_participants: 0,
    trainee_hours: 0,
    run_number: "",
    individual_group_participants: 0,
    course_type: "",
    subsidy_description: "",
    bia_level: "",
    learning_outcome: "",
    // Program-specific fields
    category: "", // for PACE workshops
    csc: false, // for non-PACE workshops
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        program_type: "",
        school_dept: "",
        course_program_title: "",
        program_start_date: "",
        program_end_date: "",
        course_hours: 0,
        no_of_participants: 1, // Default to 1 instead of 0
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
      });
      setErrors({});
    }
  }, [isOpen]);

  // Auto-calculate trainee hours when participants or course hours change
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

  const handleRadioChange = (field: string) => (value: string) => {
    if (field === "csc") {
      setFormData(prev => ({ ...prev, [field]: value === "yes" }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    // Clear error when user makes a selection
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
    if (formData.course_hours < 0) newErrors.course_hours = "Course hours cannot be negative";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create a clean data object that includes zero values
      const workshopData = {
        program_type: formData.program_type,
        school_dept: formData.school_dept,
        course_program_title: formData.course_program_title,
        program_start_date: formData.program_start_date,
        program_end_date: formData.program_end_date,
        course_hours: formData.course_hours,
        no_of_participants: formData.no_of_participants,
        company_sponsored_participants: formData.company_sponsored_participants,
        trainee_hours: formData.trainee_hours,
        run_number: formData.run_number || "",
        individual_group_participants: formData.individual_group_participants,
        course_type: formData.course_type || "",
        subsidy_description: formData.subsidy_description || "",
        bia_level: formData.bia_level || "",
        learning_outcome: formData.learning_outcome || "",
        category: formData.category || "",
        csc: formData.csc
      };

      onSubmit(workshopData);
      
      // Reset form after successful submission
      setFormData({
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
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Workshop
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter the details for the new training workshop
          </p>
        </div>

        <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Program Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Program Information
                </h3>
                <div className="space-y-4">
                  {/* Program Type - Radio Buttons */}
                  <div>
                    <Label>Program Type *</Label>
                    <div className="flex space-x-6 mt-2">
                      {PROGRAM_TYPE_OPTIONS.map((type) => (
                        <Radio
                          key={type.value}
                          id={`program_type_${type.value}`}
                          name="program_type"
                          value={type.value}
                          checked={formData.program_type === type.value}
                          label={type.label}
                          onChange={handleRadioChange("program_type")}
                        />
                      ))}
                    </div>
                    {errors.program_type && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.program_type}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>School/Department *</Label>
                    <Input
                      type="text"
                      placeholder="Enter school or department name"
                      value={formData.school_dept}
                      onChange={handleInputChange("school_dept")}
                      error={!!errors.school_dept}
                      hint={errors.school_dept}
                    />
                  </div>
                  <div>
                    <Label>Course/Program Title *</Label>
                    <Input
                      type="text"
                      placeholder="Enter course title"
                      value={formData.course_program_title}
                      onChange={handleInputChange("course_program_title")}
                      error={!!errors.course_program_title}
                      hint={errors.course_program_title}
                    />
                  </div>
                  <div>
                    <Label>Course Type</Label>
                    <Select
                      placeholder="Select course type"
                      value={formData.course_type}
                      onChange={handleSelectChange("course_type")}
                      options={COURSE_TYPE_OPTIONS}
                    />
                  </div>
                  <div>
                    <Label>Run Number</Label>
                    <Input
                      type="text"
                      placeholder="e.g., Run 1, R001"
                      value={formData.run_number}
                      onChange={handleInputChange("run_number")}
                    />
                  </div>
                </div>
              </div>

              {/* Schedule & Duration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Schedule & Duration
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Start Date *</Label>
                      <Input
                        type="date"
                        value={formData.program_start_date}
                        onChange={handleInputChange("program_start_date")}
                        error={!!errors.program_start_date}
                        hint={errors.program_start_date}
                      />
                    </div>
                    <div>
                      <Label>End Date *</Label>
                      <Input
                        type="date"
                        value={formData.program_end_date}
                        onChange={handleInputChange("program_end_date")}
                        error={!!errors.program_end_date}
                        hint={errors.program_end_date}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Course Hours</Label>
                    <Input
                      type="number"
                      placeholder="Total course hours"
                      value={formData.course_hours}
                      onChange={handleInputChange("course_hours")}
                      min="0"
                      error={!!errors.course_hours}
                      hint={errors.course_hours}
                    />
                  </div>
                </div>
              </div>

              {/* Program-Specific Fields */}
              {formData.program_type && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                    {formData.program_type === "pace" ? "PACE Program Details" : "NON-PACE Program Details"}
                  </h3>
                  <div className="space-y-3">
                    {formData.program_type === "pace" ? (
                      <div>
                        <Label>Category *</Label>
                        <Select
                          placeholder="Select PACE category"
                          value={formData.category}
                          onChange={handleSelectChange("category")}
                          options={PACE_CATEGORY_OPTIONS}
                        />
                        {errors.category && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Label>CSC Eligible</Label>
                        <div className="flex space-x-6">
                          <Radio
                            id="csc-yes"
                            name="csc"
                            value="yes"
                            checked={formData.csc}
                            label="Yes"
                            onChange={handleRadioChange("csc")}
                          />
                          <Radio
                            id="csc-no"
                            name="csc"
                            value="no"
                            checked={!formData.csc}
                            label="No"
                            onChange={handleRadioChange("csc")}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Participant Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Participant Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label>Total Participants *</Label>
                    <Input
                      type="number"
                      placeholder="Total number of participants"
                      value={formData.no_of_participants}
                      onChange={handleInputChange("no_of_participants")}
                      min="1"
                      error={!!errors.no_of_participants}
                      hint={errors.no_of_participants}
                    />
                  </div>
                  <div>
                    <Label>Company Sponsored Participants</Label>
                    <Input
                      type="number"
                      placeholder="Number sponsored by companies"
                      value={formData.company_sponsored_participants}
                      onChange={handleInputChange("company_sponsored_participants")}
                      min="0"
                      error={!!errors.company_sponsored_participants}
                      hint={errors.company_sponsored_participants}
                    />
                  </div>
                  <div>
                    <Label>Individual/Group Participants (Auto-calculated)</Label>
                    <Input
                      type="number"
                      value={formData.individual_group_participants}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Calculated as: Total Participants - Company Sponsored
                    </p>
                  </div>
                  <div>
                    <Label>Trainee Hours (Auto-calculated)</Label>
                    <Input
                      type="number"
                      value={formData.trainee_hours}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Calculated as: Total Participants × Course Hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Additional Information
                </h3>
                <div className="space-y-4">
                  {/* BIA Level - Radio Buttons */}
                  <div>
                    <Label>BIA Level</Label>
                    <div className="flex space-x-6 mt-2">
                      {BIA_LEVEL_OPTIONS.map((level) => (
                        <Radio
                          key={level.value}
                          id={`bia_level_${level.value}`}
                          name="bia_level"
                          value={level.value}
                          checked={formData.bia_level === level.value}
                          label={level.label}
                          onChange={handleRadioChange("bia_level")}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Subsidy Description</Label>
                    <Input
                      type="text"
                      placeholder="e.g., 90% SkillsFuture subsidy"
                      value={formData.subsidy_description}
                      onChange={handleInputChange("subsidy_description")}
                    />
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Learning Outcomes
                </h3>
                <div>
                  <Label>Learning Outcomes</Label>
                  <TextArea
                    placeholder="Describe the key learning outcomes and objectives..."
                    value={formData.learning_outcome}
                    onChange={handleTextAreaChange("learning_outcome")}
                    rows={4}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
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
              Create Workshop
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default NewWorkshopForm;