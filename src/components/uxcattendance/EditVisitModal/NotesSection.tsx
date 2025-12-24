import React from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";

interface NotesSectionProps {
  formData: {
    notes: string;
  };
  onTextAreaChange: (field: string) => (value: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  formData,
  onTextAreaChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 pt-4">
        Additional Information
      </h3>
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
    </div>
  );
};

export default NotesSection;