import React from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";

interface NotesDisplayProps {
  visit: Visit;
}

const NotesDisplay: React.FC<NotesDisplayProps> = ({ visit }) => {
  return (
    <div className="space-y-4 pb-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 pt-6">
        Additional Notes
      </h3>
      <div>
        <Label>Visit Notes</Label>
        <TextArea
          value={visit.notes || "No visit notes"}
          rows={4}
          disabled={true}
        />
      </div>
    </div>
  );
};

export default NotesDisplay;