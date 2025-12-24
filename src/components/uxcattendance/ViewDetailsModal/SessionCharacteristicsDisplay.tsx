import React from "react";
import Radio from "@/components/form/input/Radio";
import DetailsSection from "./DetailsSection";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";

interface SessionCharacteristicsDisplayProps {
  visit: Visit;
}

const SessionCharacteristicsDisplay: React.FC<SessionCharacteristicsDisplayProps> = ({ visit }) => {
  return (
    <DetailsSection title="Session Characteristics">
      <div className="space-y-3">
        <Radio
          id="pace-program"
          name="pace"
          value="pace"
          checked={visit.pace}
          label="PACE Program"
          onChange={() => {}}
          disabled={true}
        />
        <Radio
          id="informal-session"
          name="informal"
          value="informal"
          checked={visit.informal}
          label="Informal Session"
          onChange={() => {}}
          disabled={true}
        />
      </div>
    </DetailsSection>
  );
};

export default SessionCharacteristicsDisplay;