import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface RevenueSectionProps {
  formData: {
    revenue: number;
  };
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RevenueSection: React.FC<RevenueSectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Financial Impact
      </h3>
      <div>
        <Label>Revenue Generated (SGD)</Label>
        <Input
          type="number"
          placeholder="0.00"
          value={formData.revenue ?? ""}
          onChange={onInputChange("revenue")}
          min="0"
          step={0.01}
        />
      </div>
    </div>
  );
};

export default RevenueSection;