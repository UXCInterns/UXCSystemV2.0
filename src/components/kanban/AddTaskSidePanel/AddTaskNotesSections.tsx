import React from "react";
import TextArea from "@/components/form/input/TextArea";

interface TaskNotesSectionsProps {
  description: string;
  comments: string;
  onDescriptionChange: (value: string) => void;
  onCommentsChange: (value: string) => void;
}

export default function AddTaskNotesSections({
  description,
  comments,
  onDescriptionChange,
  onCommentsChange
}: TaskNotesSectionsProps) {
  return (
    <>
      {/* Description Section */}
      <div className="pt-4 border-t border-gray-200 dark:border-white/[0.05]">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
          Description
        </h4>
        <TextArea
          value={description}
          onChange={onDescriptionChange}
          rows={4}
          placeholder="Enter task description"
        />
      </div>

      {/* Internal Notes Section */}
      <div className="pt-4 border-t border-gray-200 dark:border-white/[0.05]">
        <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-4">
          Internal Notes
        </h4>
        <TextArea
          value={comments}
          onChange={onCommentsChange}
          rows={3}
          placeholder="Enter internal notes"
        />
      </div>
    </>
  );
}