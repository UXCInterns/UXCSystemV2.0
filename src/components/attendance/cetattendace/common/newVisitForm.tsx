"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "../../../form/Label";
import Input from "../../../form/input/InputField";
import Select from "../../../form/Select";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import { ChevronDownIcon, TimeIcon } from "../../../../icons";
import ComponentCard from "@/components/common/ComponentCard";


interface Option {
  label: string;
  value: string;
}

interface NewVisitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: NewVisitFormData) => void;
}

export interface NewVisitFormData {
  programTitle: string;
  category: string;
  department: string;
  runNumber: number;
  startDate: string;
  endDate: string;
  courseHours: number;
  noOfPax: number;
  companySponsored: number;
  traineeHours: number;
  courseType: string;
  BIALevel: string;
  subsidyDesc: string;
  learningOutcome: string;
  participants: number;
}

// Define options for each Select field
const sessionOptions: Option[] = [
  { label: "AM", value: "am" },
  { label: "PM", value: "pm" },
];

const BIALevelOptions: Option[] = [
  { label: "Basic", value: "Basic" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

const courseTypeOptions: Option[] = [
  { label: "Short Course", value: "Short_Course" },
  { label: "E-Learning", value: "E-Learning" },
  { label: "Seminar", value: "Seminar" },
  { label: "Workshop", value: "Workshop" },
  { label: "Coaching", value: "Coaching" },
];

const categoryOptions: Option[] = [
  { label: "DTBI", value: "DTBI" },
  { label: "DT101", value: "DT101" },
  { label: "DTUX-LJ", value: "DTUX-LJ" },
  { label: "SPID", value: "SPID" },
  { label: "DTAI", value: "DTAI" },
];

const NewVisitForm: React.FC<NewVisitFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<NewVisitFormData>({
    programTitle: "",
    category: "",
    department: "",
    runNumber: 0,
    startDate: "",
    endDate: "",
    courseHours: 0,
    noOfPax: 0,
    companySponsored: 0,
    traineeHours: 0,
    courseType: "",
    BIALevel: "",
    subsidyDesc: "",
    participants: 0,
    learningOutcome: "",
  });

  const handleChange = (field: keyof NewVisitFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const traineeHours = form.courseHours * form.noOfPax;
    handleChange("traineeHours", isNaN(traineeHours) ? 0 : traineeHours);
  }, [form.courseHours, form.noOfPax]);


  const handleSelectChange = (field: keyof NewVisitFormData) => (selected: Option | null) => {
    console.log(`Selected ${field}:`, selected);
    handleChange(field, selected ? selected.value : "");
  };

  const handleStartDateChange = (_dates: any, currentDateString: string) => {
    handleChange("startDate", currentDateString);
  };

  const handleEndDateChange = (_date: Date | null, currentDateString: string) => {
    const start = new Date(form.startDate);
    const end = new Date(currentDateString);

    if (form.startDate && end < start) {
      alert("End date cannot be before start date.");
      return;
    }

    handleChange("endDate", currentDateString || "");
  };

  const requiredFields: (keyof NewVisitFormData)[] = [
    "programTitle",
    "startDate",
    "endDate",
    "noOfPax", 
    "courseHours",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any required fields are missing
    const missingField = requiredFields.find((field) => {
      const value = form[field];
        return (
        value === "" ||
        value === null ||
        value === undefined ||
        (typeof value === "number" && value === 0)
      );
    });

    if (missingField) {
      alert(`Please fill out the required field: ${missingField}`);
      return;
    }

    if (onSubmit) {
      onSubmit(form);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] lg:p-3">
      <ComponentCard title="Add New Visit">
        <form onSubmit={handleSubmit} className="space-y-6 px-4">
          {/* First Row */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <Label>
                Program Title<span className="text-red-500 ml-2">*</span>
              </Label>
              <Input
                type="text"
                value={form.programTitle}
                onChange={(e) => {
                  const input = e.target.value;
                  const capitalized = input.charAt(0).toUpperCase() + input.slice(1);
                  handleChange("programTitle", capitalized);
                }}
              />
            </div>
            <div className="flex-1">
              <Label>
                School/Department
              </Label>
              <Input
                type="text"
                value={form.department}
                onChange={(e) => {
                  const input = e.target.value;
                  const capitalized = input.charAt(0).toUpperCase() + input.slice(1);
                  handleChange("department", capitalized);
                }}
              />
            </div>
            <div className="flex-1">
              <Label>Run Number</Label>
              <Input
                type="number"
                value={form.runNumber}
                onChange={(e) => handleChange("runNumber", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <DatePicker
                id="date-picker"
                label={
                  <>
                    Start Date <span className="text-red-500 ml-2">*</span>
                  </>
                }
                placeholder="Select a date"
                onChange={handleStartDateChange}
                value={form.startDate}
              />
            </div>
            <div className="flex-1">
              <DatePicker
                id="end-date"
                label={
                  <>
                    End Date <span className="text-red-500 ml-2">*</span>
                  </>
                }
                placeholder="Select a date"
                onChange={handleEndDateChange}
                value={form.endDate}
                minDate={form.startDate ? new Date(form.startDate) : undefined}
              />
            </div>
            <div className="flex-1">
              <Label>No. of Participants<span className="text-red-500 ml-2">*</span></Label>
              <Input
                type="number"
                value={form.noOfPax}
                onChange={(e) => handleChange("noOfPax", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <Label>Course Hours<span className="text-red-500 ml-2">*</span></Label>
              <Input
                type="number"
                value={form.courseHours}
                onChange={(e) => handleChange("courseHours", Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <Label>Company Sponsored</Label>
              <Input
                type="number"
                value={form.companySponsored}
                onChange={(e) => handleChange("companySponsored", Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <Label>Trainee Hours</Label>
              <Input type="number" value={form.traineeHours} readOnly disabled/>
            </div>
            <div className="flex-1">
              <Label>Individual/Group Participants</Label>
              <Input type="number" value={form.participants}/>
            </div>
          </div>

          {/* Fourth Row */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <Label>Category</Label>
              <div className="relative">
                <Select
                  options={categoryOptions}
                  placeholder="Select industry"
                  onChange={handleSelectChange("category")}
                  className="dark:bg-dark-900"
                  value={categoryOptions.find((o) => o.value === form.category) || null}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className="flex-1">
              <Label>Course Type</Label>
              <div className="relative">
                <Select
                  options={courseTypeOptions}
                  placeholder="Select industry"
                  onChange={handleSelectChange("courseType")}
                  className="dark:bg-dark-900"
                  value={courseTypeOptions.find((o) => o.value === form.courseType) || null}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className="flex-1">
              <Label>BIA Level</Label>
              <div className="relative">
                <Select
                  options={BIALevelOptions}
                  placeholder="Select BIA Level"
                  onChange={handleSelectChange("BIALevel")}
                  className="dark:bg-dark-900"
                  value={BIALevelOptions.find((o) => o.value === form.BIALevel) || null}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          </div>

          {/* Final Row */}
          <div className="flex space-x-6">
            <div className="flex-2">
              <Label>Subsidy Description</Label>
              <TextArea
                value={form.subsidyDesc}
                onChange={(e) => handleChange("subsidyDesc", e.target.value)}
              />
            </div>
            <div className="flex-2">
              <Label>Learning Outcome</Label>
              <TextArea
                value={form.learningOutcome}
                onChange={(e) => handleChange("learningOutcome", e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mb-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </ComponentCard>
    </Modal>
  );
};

export default NewVisitForm;
