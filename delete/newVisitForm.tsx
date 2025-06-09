"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import DatePicker from "@/components/form/date-picker";
import TextArea from "../form/input/TextArea";
import { ChevronDownIcon, TimeIcon } from "../../icons";
import ComponentCard from "../common/ComponentCard";

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
  companyName: string;
  uenNumber: string;
  dateOfVisit: string;
  totalRegistered: number;
  totalAttended: number;
  revenue: number;
  startTime: string;
  endTime: string;
  session: string;
  durationHours: string;
  sector: string;
  industry: string;
  size: string;
  conversionStatus: string;
  notes: string;
  checkboxChecked: boolean;
}

// Define options for each Select field
const sessionOptions: Option[] = [
  { label: "AM", value: "am" },
  { label: "PM", value: "pm" },
];

const sectorOptions: Option[] = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Non-profit", value: "nonprofit" },
  { label: "Professional Body", value: "professional_body" },
  { label: "Commercial", value: "commercial" },
  { label: "Statutory Board", value: "statutory_board" },
];

const industryOptions: Option[] = [
  { label: "Agriculture & Farming", value: "agriculture_farming" },
  { label: "Arts & Culture", value: "arts_culture" },
  { label: "Aviation & Aerospace", value: "aviation_aerospace" },
  { label: "Banking", value: "banking" },
  { label: "Biomedical Sciences", value: "biomedical_sciences" },
  { label: "Border Control & Immigration", value: "border_control_immigration" },
  { label: "Community Services", value: "community_services" },
  { label: "Consulting Services", value: "consulting_services" },
  { label: "Construction & Engineering", value: "construction_engineering" },
  { label: "Cosmetics", value: "cosmetics" },
  { label: "Defense & Security", value: "defense_security" },
  { label: "Digital & Technology", value: "digital_technology" },
  { label: "Diplomatic Services", value: "diplomatic_services" },
  { label: "Education", value: "education" },
  { label: "Education (Higher)", value: "education_higher" },
  { label: "Education (Primary/Secondary)", value: "education_primary_secondary" },
  { label: "Education Technology", value: "education_technology" },
  { label: "Energy & Resources", value: "energy_resources" },
  { label: "Environmental Services", value: "environmental_services" },
  { label: "Financial Services", value: "financial_services" },
  { label: "Food & Beverage", value: "food_beverage" },
  { label: "Healthcare & Medical", value: "healthcare_medical" },
  { label: "Industry Associations & Chambers", value: "industry_associations_chambers" },
  { label: "Information Technology", value: "information_technology" },
  { label: "Infrastructure & Utilities", value: "infrastructure_utilities" },
  { label: "Innovation & Enterprise", value: "innovation_enterprise" },
  { label: "Insurance", value: "insurance" },
  { label: "Investment & Asset Management", value: "investment_asset_management" },
  { label: "Legal Services", value: "legal_services" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Manufacturing (Chemical/Pharma)", value: "manufacturing_chemical_pharma" },
  { label: "Manufacturing (Electronics/Technology)", value: "manufacturing_electronics_technology" },
  { label: "Manufacturing (F&B/FMCG)", value: "manufacturing_fnb_fmcg" },
  { label: "Manufacturing (Marine/Offshore)", value: "manufacturing_marine_offshore" },
  { label: "Maritime", value: "maritime" },
  { label: "Maritime & Shipping", value: "maritime_shipping" },
  { label: "Media & Entertainment", value: "media_entertainment" },
  { label: "Pharmaceutical", value: "pharmaceutical" },
  { label: "Professional Services", value: "professional_services" },
  { label: "Property & Real Estate", value: "property_real_estate" },
  { label: "Public Administration", value: "public_administration" },
  { label: "Public Safety & Security", value: "public_safety_security" },
  { label: "Public Services", value: "public_services" },
  { label: "Research", value: "research" },
  { label: "Research & Development", value: "research_development" },
  { label: "Retail & Consumer", value: "retail_consumer" },
  { label: "Science & Technology", value: "science_technology" },
  { label: "Sports & Recreation", value: "sports_recreation" },
  { label: "Telecommunications", value: "telecommunications" },
  { label: "Tourism & Hospitality", value: "tourism_hospitality" },
  { label: "Transportation & Logistics", value: "transportation_logistics" },
];

const sizeOptions: Option[] = [
  { label: "Government-Linked Company (GLC)", value: "glc" },
  { label: "Government-Linked Institution (GLI)", value: "gli" },
  { label: "Multinational Corporation (MNC)", value: "mnc" },
  { label: "Small-Medium Enterprise (SME)", value: "sme" },
  { label: "Startup", value: "startup" },
];

const conversionOptions: Option[] = [
  { label: "Training", value: "training" },
  { label: "Consultancy", value: "consultancy" },
];

const NewVisitForm: React.FC<NewVisitFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState<NewVisitFormData>({
    companyName: "",
    uenNumber: "",
    dateOfVisit: "",
    totalRegistered: 0,
    totalAttended: 0,
    revenue: 0,
    startTime: "",
    endTime: "",
    session: "",
    durationHours: "",
    sector: "",
    industry: "",
    size: "",
    conversionStatus: "No Conversion",
    notes: "",
    checkboxChecked: false,
  });

  const handleChange = (field: keyof NewVisitFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof NewVisitFormData) => (selected: Option | null) => {
    handleChange(field, selected ? selected.value : "");
  };

  const handleDateChange = (_dates: any, currentDateString: string) => {
    handleChange("dateOfVisit", currentDateString);
  };

  const handleCheckboxChange = (checked: boolean) => {
    handleChange("checkboxChecked", checked);
  };

  const calculateDurationHours = (start: string, end: string): string => {
    if (!start || !end) return "";

    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0);

    const diffMs = endDate.getTime() - startDate.getTime();
    if (diffMs <= 0) return "";

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const handleTimeChange = (field: "startTime" | "endTime", value: string) => {
    const updatedForm = {
      ...form,
      [field]: value,
    };

    updatedForm.durationHours = calculateDurationHours(
      field === "startTime" ? value : form.startTime,
      field === "endTime" ? value : form.endTime
    );

    setForm(updatedForm);
  };

  const requiredFields: (keyof NewVisitFormData)[] = [
    "companyName",
    "dateOfVisit",
    "totalAttended",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if any required fields are missing
    const missingField = requiredFields.find((field) => {
      const value = form[field];
      return value === "" || value === null || value === undefined || value === 0;
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Row */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <Label>Company Name<span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={form.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label>UEN Number</Label>
              <Input
                type="text"
                value={form.uenNumber}
                onChange={(e) => handleChange("uenNumber", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <DatePicker
                id="date-picker"
                label={
                  <>
                    Date of Visit <span className="text-red-500">*</span>
                  </>
                }
                placeholder="Select a date"
                onChange={handleDateChange}
                value={form.dateOfVisit}
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <Label>Total Registered</Label>
              <Input
                type="number"
                value={form.totalRegistered}
                onChange={(e) => handleChange("totalRegistered", Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <Label>Total Attended<span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={form.totalAttended}
                onChange={(e) => handleChange("totalAttended", Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <Label>Revenue ($)</Label>
              <Input
                type="number"
                value={form.revenue}
                onChange={(e) => handleChange("revenue", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Third Row */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <Label>Start Time</Label>
              <div className="relative">
                <Input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => handleTimeChange("startTime", e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <TimeIcon />
                </span>
              </div>
            </div>
            <div className="flex-1">
              <Label>End Time</Label>
              <div className="relative">
                <Input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => handleTimeChange("endTime", e.target.value)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <TimeIcon />
                </span>
              </div>
            </div>
            <div className="flex-1">
              <Label>AM/PM Session</Label>
              <div className="relative">
                <Select
                  options={sessionOptions}
                  placeholder="Select session"
                  onChange={handleSelectChange("session")}
                  className="dark:bg-dark-900"
                  value={sessionOptions.find((o) => o.value === form.session) || null}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
              <div className="flex-1">
                <Label>Duration (hours)</Label>
                <Input type="number" value={form.durationHours} readOnly disabled/>
              </div>
          </div>

          {/* Fourth Row */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <Label>Sector</Label>
              <div className="relative">
                <Select
                  options={sectorOptions}
                  placeholder="Select sector"
                  onChange={handleSelectChange("sector")}
                  className="dark:bg-dark-900"
                  value={sectorOptions.find((o) => o.value === form.sector) || null}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className="flex-1">
              <Label>Industry</Label>
              <div className="relative">
                <Select
                  options={industryOptions}
                  placeholder="Select industry"
                  onChange={handleSelectChange("industry")}
                  className="dark:bg-dark-900"
                  value={industryOptions.find((o) => o.value === form.industry) || null}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className="flex-1">
              <Label>Size</Label>
              <div className="relative">
                <Select
                  options={sizeOptions}
                  placeholder="Select size"
                  onChange={handleSelectChange("size")}
                  className="dark:bg-dark-900"
                  value={sizeOptions.find((o) => o.value === form.size) || null}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
          </div>

          {/* Final Row */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <Label>Conversion</Label>
              <div className="relative">
                <Select
                  options={conversionOptions}
                  placeholder="Select conversion"
                  onChange={handleSelectChange("conversionStatus")}
                  className="dark:bg-dark-900"
                  value={conversionOptions.find((o) => o.value === form.conversionStatus) || null}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
              </div>
            </div>
            <div className="flex-2">
              <Label>Notes</Label>
              <TextArea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
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
