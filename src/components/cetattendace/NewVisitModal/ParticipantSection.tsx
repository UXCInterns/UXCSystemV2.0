import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { NewWorkshopFormData } from "@/types/WorkshopTypes/workshop";

interface ParticipantSectionProps {
  formData: NewWorkshopFormData;
  errors: Record<string, string>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ParticipantSection: React.FC<ParticipantSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Participant Information
      </h3>
      <div className="space-y-3">
        <div>
          <Label>Total Participants *</Label>
          <Input
            type="number"
            placeholder="Total number of participants"
            value={formData.no_of_participants}
            onChange={onInputChange("no_of_participants")}
            min="1"
            error={!!errors.no_of_participants}
            hint={errors.no_of_participants}
          />
        </div>
        <div>
          <Label>Company Sponsored Participants</Label>
          <Input
            type="number"
            placeholder="Number sponsored by companies"
            value={formData.company_sponsored_participants}
            onChange={onInputChange("company_sponsored_participants")}
            min="0"
            error={!!errors.company_sponsored_participants}
            hint={errors.company_sponsored_participants}
          />
        </div>
        <div>
          <Label>Individual/Group Participants (Auto-calculated)</Label>
          <Input
            type="number"
            value={formData.individual_group_participants}
            disabled
            className="bg-gray-100 dark:bg-gray-800"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Calculated as: Total Participants - Company Sponsored
          </p>
        </div>
        <div>
          <Label>Trainee Hours (Auto-calculated)</Label>
          <Input
            type="number"
            value={formData.trainee_hours}
            disabled
            className="bg-gray-100 dark:bg-gray-800"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Calculated as: Total Participants × Course Hours
          </p>
        </div>
      </div>
    </div>
  );
};