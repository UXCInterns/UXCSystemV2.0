import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";

interface SessionCharacteristicsSectionProps {
  formData: {
    pace: boolean;
    informal: boolean;
  };
  onSessionTypeChange: (type: 'pace' | 'informal' | 'neither') => void;
}

const SessionCharacteristicsSection: React.FC<SessionCharacteristicsSectionProps> = ({
  formData,
  onSessionTypeChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Session Characteristics
      </h3>
      <div className="space-y-3">
        <Label>Type of Session</Label>
        <div className="space-y-3">
          <Radio
            id="pace-program"
            name="session-characteristic"
            value="pace"
            checked={formData.pace && !formData.informal}
            label="PACE Program"
            onChange={() => onSessionTypeChange('pace')}
          />
          <Radio
            id="informal-session"
            name="session-characteristic"
            value="informal"
            checked={formData.informal && !formData.pace}
            label="Informal Session"
            onChange={() => onSessionTypeChange('informal')}
          />
          <Radio
            id="neither-session"
            name="session-characteristic"
            value="neither"
            checked={!formData.pace && !formData.informal}
            label="Neither"
            onChange={() => onSessionTypeChange('neither')}
          />
        </div>
      </div>
    </div>
  );
};

export default SessionCharacteristicsSection;