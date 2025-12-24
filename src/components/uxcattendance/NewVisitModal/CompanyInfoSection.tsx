import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import FormSection from "./FormSection";
import { VisitFormData, FormErrors } from "@/types/LearningJourneyAttendanceTypes/visit";

interface CompanyInfoSectionProps {
  formData: VisitFormData;
  errors: FormErrors;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string) => (value: string) => void;
  sectors: string[];
  industries: string[];
  organizationSizes: string[];
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  formData,
  errors,
  onInputChange,
  onSelectChange,
  sectors,
  industries,
  organizationSizes,
}) => {
  return (
    <FormSection title="Company Information">
      <div className="space-y-3">
        <div>
          <Label>Company Name *</Label>
          <Input
            type="text"
            placeholder="Enter company name"
            value={formData.company_name}
            onChange={onInputChange("company_name")}
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
            onChange={onInputChange("uen_number")}
            className="font-mono"
          />
        </div>
        <div>
          <Label>Industry</Label>
          <Select
            placeholder="Select industry"
            value={formData.industry}
            onChange={onSelectChange("industry")}
            options={industries.map(industry => ({
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
            onChange={onSelectChange("sector")}
            options={sectors.map(sector => ({
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
            onChange={onSelectChange("size")}
            options={organizationSizes.map(size => ({
              value: size,
              label: size
            }))}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default CompanyInfoSection;