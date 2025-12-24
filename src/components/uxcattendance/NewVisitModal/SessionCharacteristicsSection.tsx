import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import FormSection from "./FormSection";
import { VisitFormData } from "@/types/LearningJourneyAttendanceTypes/visit";

interface SessionCharacteristicsSectionProps {
  formData: VisitFormData;
  setFormData: React.Dispatch<React.SetStateAction<VisitFormData>>;
}

const SessionCharacteristicsSection: React.FC<SessionCharacteristicsSectionProps> = ({
  formData,
  setFormData,
}) => {
  return (
    <FormSection title="Session Characteristics">
      <div className="space-y-3">
        <Label>Type of Session</Label>
        <div className="space-y-3">
          <Radio
            id="pace-program"
            name="session-characteristic"
            value="pace"
            checked={formData.pace && !formData.informal}
            label="PACE Program"
            onChange={() => setFormData(prev => ({ ...prev, pace: true, informal: false }))}
          />
          <Radio
            id="informal-session"
            name="session-characteristic"
            value="informal"
            checked={formData.informal && !formData.pace}
            label="Informal Session"
            onChange={() => setFormData(prev => ({ ...prev, informal: true, pace: false }))}
          />
          <Radio
            id="neither-session"
            name="session-characteristic"
            value="neither"
            checked={!formData.pace && !formData.informal}
            label="Neither"
            onChange={() => setFormData(prev => ({ ...prev, pace: false, informal: false }))}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default SessionCharacteristicsSection;