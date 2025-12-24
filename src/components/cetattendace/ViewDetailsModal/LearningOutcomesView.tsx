import React from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";

interface Workshop {
  learning_outcome?: string;
}

interface LearningOutcomesViewProps {
  workshop: Workshop;
}

export const LearningOutcomesView: React.FC<LearningOutcomesViewProps> = ({ workshop }) => {
  return (
    <div className="space-y-4 pb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 pt-6">
        Learning Outcomes
      </h3>
      <div>
        <Label>Course Objectives & Learning Outcomes</Label>
        <TextArea
          value={workshop.learning_outcome || "No learning outcomes provided."}
          rows={4}
          disabled={true}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};