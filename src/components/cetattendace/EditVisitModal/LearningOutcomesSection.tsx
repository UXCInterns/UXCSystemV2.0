import React from "react";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";

interface LearningOutcomesSectionProps {
  value: string;
  onChange: (field: string) => (value: string) => void;
}

export const LearningOutcomesSection: React.FC<LearningOutcomesSectionProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Learning Outcomes
      </h3>
      <div>
        <Label>Learning Outcome Description</Label>
        <TextArea
          placeholder="Describe the expected learning outcomes..."
          value={value}
          onChange={onChange("learning_outcome")}
          rows={4}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};