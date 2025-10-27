"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal/index";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Select from "@/components/form/Select";
import { Project } from "@/types/project";

interface NewProjectFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (projectData: any) => void;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({
    isOpen,
    onClose,
    onSubmit,

}) => {
    const [formData, setFormData] = useState({
        project_id: "",
        project_name: "",
        start_date: "",
        end_date: "",
        description: "",
        status:"",


    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const processFormDataForSubmission = (data: any) => {
        const processedData = { ...data };

        // Convert empty strings to null for string fields
        Object.keys(processedData).forEach(key => {
            if (typeof processedData[key] === 'string' && processedData[key].trim() === '') {
                processedData[key] = null;
            }
        });

        return processedData;
    };

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

        if (!formData.project_name) newErrors.project_name = "Project Name is required";
        if (!formData.start_date) newErrors.start_date = "Project Start date is required";
        if (!formData.end_date) newErrors.end_date = "Project End date is required";



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
            // Process form data to convert empty values to null
            const processedData = processFormDataForSubmission(formData);
            onSubmit(processedData);

            // Reset form
            setFormData({
                project_id: "",
                project_name: "",
                start_date: "",
                end_date: "",
                description: "",
                status:"",
            });
            onClose();
        }
    };

    return (<Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl max-h-[90vh] p-2">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Log New Project
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Enter the details for the New Project
                </p>
            </div>

            <div className="flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar px-4">
  <div className="space-y-8">
    {/* Project Information */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Project Information
      </h3>

      {/* Each input block looks like a survey question */}
      <div className="space-y-1">
        <Label>Project Name *</Label>
        <Input
          type="text"
          placeholder="Enter project name"
          value={formData.project_name}
          onChange={handleInputChange("project_name")}
          error={!!errors.project_name}
          hint={errors.project_name}
          className="w-full"
        />
      </div>

      <div className="space-y-1">
        <Label>Project Description</Label>
       <Input
          type="text"
          placeholder="Enter desc"
          value={formData.description}
          onChange={handleInputChange("description")}
          error={!!errors.description}
          hint={errors.description}
          className="w-full"
        />
      </div>
    </div>

    {/* Session Details */}
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Session Details
      </h3>

      {/* <div className="space-y-1">
        <Label>Assign Team *</Label>
        <Input
          type="text"
          placeholder="Enter assigned team or members"
          value={formData.description || ""}
          onChange={handleInputChange("description")}
          className="w-full"
        />
      </div> */}

      <div className="space-y-1">
        <Label>Start Date *</Label>
        <Input
          type="date"
          value={formData.start_date}
          onChange={handleInputChange("start_date")}
          error={!!errors.start_date}
          hint={errors.start_date}
          className="w-full"
        />
      </div>

      <div className="space-y-1">
        <Label>End Date / Deadline *</Label>
        <Input
          type="date"
          value={formData.end_date}
          onChange={handleInputChange("end_date")}
          error={!!errors.end_date}
          hint={errors.end_date}
          className="w-full"
        />
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
                        Save Project
                    </button>
                </div>
            </div>
        </form>
    </Modal>)
}

export default NewProjectForm;