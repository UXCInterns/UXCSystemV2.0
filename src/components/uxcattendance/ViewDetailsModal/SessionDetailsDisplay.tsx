import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DetailsSection from "./DetailsSection";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";
import { formatDisplayDate, getCalculatedSessionType } from "@/utils/WorkshopAttendanceUtils/ViewDetailsModalUtils/formatUtils";

interface SessionDetailsDisplayProps {
  visit: Visit;
}

const SessionDetailsDisplay: React.FC<SessionDetailsDisplayProps> = ({ visit }) => {
  const calculatedSessionType = getCalculatedSessionType(visit.start_time);

  return (
    <DetailsSection title="Session Details">
      <div className="space-y-3">
        <div>
          <Label>Date of Visit</Label>
          <Input
            type="text"
            value={formatDisplayDate(visit.date_of_visit)}
            disabled={true}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Start Time</Label>
            <Input
              type="time"
              value={visit.start_time || ""}
              disabled={true}
            />
          </div>
          <div>
            <Label>End Time</Label>
            <Input
              type="time"
              value={visit.end_time || ""}
              disabled={true}
            />
          </div>
        </div>
        <div>
          <Label>Duration</Label>
          <Input
            type="text"
            value={visit.duration || ""}
            disabled={true}
          />
        </div>
        <div>
          <Label>Session Type (Auto-calculated)</Label>
          <Input
            type="text"
            value={calculatedSessionType}
            disabled={true}
            className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Calculated from start time: {calculatedSessionType === 'AM' ? 'Before 12:00' : '12:00 and after'}
          </p>
        </div>
      </div>
    </DetailsSection>
  );
};

export default SessionDetailsDisplay;