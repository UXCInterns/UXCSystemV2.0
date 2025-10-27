"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/index";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";

import { Project } from "@/types/project";
import { Description } from "@headlessui/react";


interface EditProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: any) => void;
  project?: Project | null;
}

const EditProjectForm: React.FC<EditProjectFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
}) => {
  const [formData, setFormData] = useState({
    project_id: "",
    project_name: "",
    start_date: "",
    end_date: "",
    description: "",


  });


  const [errors, setErrors] = useState<Record<string, string>>({});

  // FIXED: Reset form data when modal closes or visit changes
  useEffect(() => {
    if (isOpen && project) {
      setFormData({
        project_id: project.project_id,
        project_name: project.project_name,
        start_date: project.start_date,
        end_date: project.end_date,
        description: project.description,

      });
      setErrors({}); // Clear any existing errors
    } else if (!isOpen) {
      // Reset form data when modal closes
      setFormData({
        project_id: "",
        project_name: "",
        start_date: "",
        end_date: "",
        description: "",

      });
      setErrors({});
    }
  }, [isOpen, project]);

  
  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const startTime = new Date(`2000-01-01T${formData.start_date}`);
      const endTime = new Date(`2000-01-01T${formData.end_date}`);

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
  }, [formData.start_date, formData.end_date]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };



  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.start_date) newErrors.date_of_visit = "Project Start date is required";
    if (!formData.end_date) newErrors.start_time = "Project End date is required";



    // Validate time order
    if (formData.start_date && formData.end_date) {
      const startTime = new Date(`2000-01-01T${formData.start_date}`);
      const endTime = new Date(`2000-01-01T${formData.end_date}`);
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
  if (!project) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
      <form key={`edit-${project.project_id}-${isOpen}`} onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Project
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update the details for this Project
          </p>
        </div>

        <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                  Project Information
                </h3>
                <div className="space-y-3">
                   
                      <div>
                        <Label>Project Name*</Label>
                        <Input
                          type="text"
                          value={formData.project_name}
                          onChange={handleInputChange("project_name")}
                          error={!!errors.project_name}
                          hint={errors.project_name}
                        />
                      </div>



                  {/* Session Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
                      Session Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <Label>Start Date *</Label>
                        <Input
                          type="date"
                          value={formData.start_date}
                          onChange={handleInputChange("date_of_visit")}
                          error={!!errors.date_of_visit}
                          hint={errors.date_of_visit}
                        />
                      </div>

                      <Label>End date *</Label>
                      <Input
                        type="time"
                        value={formData.end_date}
                        onChange={handleInputChange("end_time")}
                        error={!!errors.end_date}
                        hint={errors.end_time}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}

          </div>

          {/* Notes - Full Width */}

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

export default EditProjectForm