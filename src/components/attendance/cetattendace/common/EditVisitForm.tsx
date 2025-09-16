"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/index";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { PROGRAM_TYPES, COURSE_TYPES, BIA_LEVELS, PACE_CATEGORIES } from "@/hooks/workshop/useWorkshopOptions";

interface Workshop {
  id: string;
  course_program_title: string;
  program_start_date: string;
  program_end_date: string;
  no_of_participants: number;
  trainee_hours: number;
  program_type: string;
  school_dept: string;
  course_hours: number;
  company_sponsored_participants: number;
  run_number?: string;
  individual_group_participants?: number;
  course_type?: string;
  subsidy_description?: string;
  bia_level?: string;
  learning_outcome?: string;
  category?: string; // for PACE workshops
  csc?: boolean; // for non-PACE workshops
  created_at: string;
  updated_at: string;
}

interface EditWorkshopFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workshopData: any) => void;
  workshop?: Workshop | null;
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

const EditWorkshopForm: React.FC<EditWorkshopFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workshop,
}) => {
  const [formData, setFormData] = useState({
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
    category: "", // for PACE workshops
    csc: false, // for non-PACE workshops
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form data when modal closes or workshop changes
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
      // Reset form data when modal closes
      setFormData({
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
      });
      setErrors({});
    }
  }, [isOpen, workshop]);

  // Auto-calculate trainee hours when participants or course hours change
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

  const handleBiaLevelChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      bia_level: value === "none" ? "" : value 
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.course_program_title.trim()) newErrors.course_program_title = "Program title is required";
    if (!formData.school_dept) newErrors.school_dept = "School/Department is required";
    if (!formData.program_start_date) newErrors.program_start_date = "Start date is required";
    if (!formData.program_end_date) newErrors.program_end_date = "End date is required";
    if (formData.course_hours <= 0) newErrors.course_hours = "Course hours must be greater than 0";
    if (formData.no_of_participants < 0) newErrors.no_of_participants = "Must be 0 or greater";
    if (formData.company_sponsored_participants < 0) newErrors.company_sponsored_participants = "Must be 0 or greater";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Calculate individual_group_participants
      const individualGroupParticipants = Math.max(0, formData.no_of_participants - formData.company_sponsored_participants);
      
      const submitData = {
        ...formData,
        individual_group_participants: individualGroupParticipants,
      };
      
      onSubmit(submitData);
      onClose();
    }
  };

  // Don't render the form if there's no workshop data
  if (!workshop) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
      <form key={`edit-${workshop.id}-${isOpen}`} onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Workshop
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update the details for this workshop
          </p>
        </div>

        <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                    Program Information
                </h3>
                <div className="space-y-3">
                    <div className="flex space-x-6 mt-2">
                        {PROGRAM_TYPE_OPTIONS.map((type) => (
                          <Radio
                            key={type.value}
                            id={`program-type-${type.value}`}
                            name="program_type"
                            value={type.value}
                            checked={formData.program_type === type.value}
                            label={type.label}
                            onChange={() => handleSelectChange("program_type")(type.value)}
                          />
                        ))}
                    </div>
                    <div>
                    <Label>School/Department *</Label>
                    <Input
                        placeholder="Select school/department"
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
                        placeholder="Enter program title"
                        value={formData.course_program_title}
                        onChange={handleInputChange("course_program_title")}
                        error={!!errors.course_program_title}
                        hint={errors.course_program_title}
                    />
                    </div>
                    <div>
                    <Label>Run Number</Label>
                    <Input
                        type="text"
                        placeholder="e.g., R001, R002"
                        value={formData.run_number}
                        onChange={handleInputChange("run_number")}
                        className="font-mono"
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
                </div>
                </div>

                {/* Program-specific Fields */}
                {formData.program_type === "pace" && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                    PACE Program Details
                    </h3>
                    <div className="space-y-3">
                    <div>
                        <Label>Category *</Label>
                        <Select
                        placeholder="Select PACE category"
                        value={formData.category}
                        onChange={handleSelectChange("category")}
                        options={PACE_CATEGORY_OPTIONS}
                        />
                    </div>
                    </div>
                </div>
                )}

                {formData.program_type === "non_pace" && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                    Non-PACE Program Details
                    </h3>
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
                </div>
                )}

                {/* Schedule Information */}
                <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                    Schedule Information
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
                    <Label>Course Hours *</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={formData.course_hours ?? ""}
                        onChange={handleInputChange("course_hours")}
                        min="0"
                        error={!!errors.course_hours}
                        hint={errors.course_hours}
                    />
                    </div>
                </div>
                </div>
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
                    <Label>Total Number of Participants *</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={formData.no_of_participants ?? ""}
                        onChange={handleInputChange("no_of_participants")}
                        min="0"
                        error={!!errors.no_of_participants}
                        hint={errors.no_of_participants}
                    />
                    </div>
                    <div>
                    <Label>Company Sponsored Participants *</Label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={formData.company_sponsored_participants ?? ""}
                        onChange={handleInputChange("company_sponsored_participants")}
                        min="0"
                        error={!!errors.company_sponsored_participants}
                        hint={errors.company_sponsored_participants}
                    />
                    </div>
                    <div>
                    <Label>Individual/Group Participants</Label>
                    <Input
                        type="number"
                        placeholder="Auto-calculated"
                        value={Math.max(0, formData.no_of_participants - formData.company_sponsored_participants)}
                        disabled
                        className="bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Automatically calculated: Total - Company Sponsored
                    </p>
                    </div>
                    <div>
                    <Label>Total Trainee Hours</Label>
                    <Input
                        type="number"
                        placeholder="Auto-calculated"
                        value={formData.trainee_hours}
                        disabled
                        className="bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Automatically calculated: Participants × Course Hours
                    </p>
                    </div>
                </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                    Additional Information
                </h3>
                <div className="space-y-3">
                <div>
                    <Label>BIA Level</Label>
                    <div className="flex space-x-4 mt-2">
                        {BIA_LEVEL_OPTIONS.map((level) => (
                          <Radio
                            key={level.value}
                            id={`bia-${level.value.toLowerCase()}`}
                            name="bia-level"
                            value={level.value.toLowerCase()}
                            checked={formData.bia_level?.toLowerCase() === level.value.toLowerCase()}
                            label={level.label}
                            onChange={() => handleBiaLevelChange(level.value.toLowerCase())}
                          />
                        ))}
                        <Radio
                          id="bia-none"
                          name="bia-level"
                          value="none"
                          checked={!formData.bia_level || formData.bia_level === "Not specified"}
                          label="None"
                          onChange={() => handleBiaLevelChange("none")}
                        />
                    </div>
                </div>
                    <div>
                    <Label>Subsidy Description</Label>
                    <Input
                        type="text"
                        placeholder="e.g., SkillsFuture, UTAP, Company funded"
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
                    <Label>Learning Outcome Description</Label>
                    <TextArea
                    placeholder="Describe the expected learning outcomes..."
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
              Update Workshop
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditWorkshopForm;