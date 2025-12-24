import React from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import FormSection from "./FormSection";
import { VisitFormData } from "@/types/LearningJourneyAttendanceTypes/visit";

interface NotesSectionProps {
  formData: VisitFormData;
  onTextAreaChange: (field: string) => (value: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  formData,
  onTextAreaChange,
}) => {
  return (
    <FormSection title="Additional Information">
      <div>
        <Label>Visit Notes</Label>
        <TextArea
          placeholder="Enter any additional notes about the visit..."
          value={formData.notes}
          onChange={onTextAreaChange("notes")}
          rows={4}
          className="min-h-[100px]"
        />
      </div>
    </FormSection>
  );
};

export default NotesSection;