import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DetailsSection from "./DetailsSection";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";
import { formatCurrency } from "@/utils/LearningJourneyAttendanceUtils/ViewDetailsModalUtils/formatUtils";

interface RevenueDisplayProps {
  visit: Visit;
}

const RevenueDisplay: React.FC<RevenueDisplayProps> = ({ visit }) => {
  return (
    <DetailsSection title="Financial Impact">
      <div>
        <Label>Revenue Generated</Label>
        <Input
          type="text"
          value={visit.revenue > 0 ? formatCurrency(visit.revenue) : "No Revenue Generated"}
          disabled={true}
          className="text-2xl font-bold bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800"
        />
      </div>
    </DetailsSection>
  );
};

export default RevenueDisplay;