import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { SECTORS, ORGANIZATION_SIZES, INDUSTRIES } from "@/hooks/learningJourney/useOrganistationCat";

interface CompanyInformationSectionProps {
  formData: {
    company_name: string;
    uen_number: string;
    industry: string;
    sector: string;
    size: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (field: string) => (value: string) => void;
}

const CompanyInformationSection: React.FC<CompanyInformationSectionProps> = ({
  formData,
  errors,
  onInputChange,
  onSelectChange,
}) => {
  return (
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
            onChange={onSelectChange("sector")}
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
            onChange={onSelectChange("size")}
            options={ORGANIZATION_SIZES.map(size => ({
              value: size,
              label: size
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyInformationSection;