import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { WorkshopFormData } from "@/types/workshop";

interface ParticipantSectionProps {
  formData: WorkshopFormData;
  errors: Record<string, string>;
  onInputChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ParticipantSection: React.FC<ParticipantSectionProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  const individualGroupParticipants = Math.max(
    0,
    formData.no_of_participants - formData.company_sponsored_participants
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Participant Information
      </h3>
      <div className="space-y-3">
        <div>
          <Label>Total Number of Participants *</Label>
          <Input
            type="number"
            placeholder="0"
            value={formData.no_of_participants ?? ""}
            onChange={onInputChange("no_of_participants")}
            min="0"
            error={!!errors.no_of_participants}
            hint={errors.no_of_participants}
          />
        </div>
        <div>
          <Label>Company Sponsored Participants *</Label>
          <Input
            type="number"
            placeholder="0"
            value={formData.company_sponsored_participants ?? ""}
            onChange={onInputChange("company_sponsored_participants")}
            min="0"
            error={!!errors.company_sponsored_participants}
            hint={errors.company_sponsored_participants}
          />
        </div>
        <div>
          <Label>Individual/Group Participants</Label>
          <Input
            type="number"
            placeholder="Auto-calculated"
            value={individualGroupParticipants}
            disabled
            className="bg-gray-50 dark:bg-gray-800"
          />
          <p className="text-xs text-gray-500 mt-1">
            Automatically calculated: Total - Company Sponsored
          </p>
        </div>
        <div>
          <Label>Total Trainee Hours</Label>
          <Input
            type="number"
            placeholder="Auto-calculated"
            value={formData.trainee_hours}
            disabled
            className="bg-gray-50 dark:bg-gray-800"
          />
          <p className="text-xs text-gray-500 mt-1">
            Automatically calculated: Participants × Course Hours
          </p>
        </div>
      </div>
    </div>
  );
};