import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import DetailsSection from "./DetailsSection";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";

interface ConversionDisplayProps {
  visit: Visit;
}

const ConversionDisplay: React.FC<ConversionDisplayProps> = ({ visit }) => {
  return (
    <DetailsSection title="Conversion Outcomes">
      <div className="flex space-x-6">
        <div className="flex-1 space-y-3 border-r border-gray-300 dark:border-gray-800 h-full">
          <Label>Consultancy Conversion</Label>
          <Radio
            id="consultancy-yes"
            name="consultancy"
            value="yes"
            checked={visit.consultancy}
            label="Yes"
            onChange={() => {}}
            disabled={true}
            className="mb-2"
          />
          <Radio
            id="consultancy-no"
            name="consultancy"
            value="no"
            checked={!visit.consultancy}
            label="No"
            onChange={() => {}}
            disabled={true}
          />
        </div>

        <div className="flex-1 space-y-3">
          <Label>Training Conversion</Label>
          <Radio
            id="training-yes"
            name="training"
            value="yes"
            checked={visit.training}
            label="Yes"
            onChange={() => {}}
            disabled={true}
            className="mb-2"
          />
          <Radio
            id="training-no"
            name="training"
            value="no"
            checked={!visit.training}
            label="No"
            onChange={() => {}}
            disabled={true}
          />
        </div>
      </div>
    </DetailsSection>
  );
};

export default ConversionDisplay;