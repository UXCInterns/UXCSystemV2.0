import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DetailsSection from "./DetailsSection";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";

interface CompanyInfoDisplayProps {
  visit: Visit;
}

const CompanyInfoDisplay: React.FC<CompanyInfoDisplayProps> = ({ visit }) => {
  return (
    <DetailsSection title="Company Information">
      <div className="space-y-3">
        <div>
          <Label>UEN Number</Label>
          <Input
            type="text"
            value={visit.uen_number}
            disabled={true}
            className="font-mono"
          />
        </div>
        <div>
          <Label>Industry</Label>
          <Input
            type="text"
            value={visit.industry}
            disabled={true}
          />
        </div>
        <div>
          <Label>Sector</Label>
          <Input
            type="text"
            value={visit.sector}
            disabled={true}
          />
        </div>
        <div>
          <Label>Company Size</Label>
          <Input
            type="text"
            value={visit.size}
            disabled={true}
          />
        </div>
      </div>
    </DetailsSection>
  );
};

export default CompanyInfoDisplay;