import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";

interface Workshop {
  bia_level?: string;
  subsidy_description?: string;
}

interface CourseAdministrationViewProps {
  workshop: Workshop;
}

export const CourseAdministrationView: React.FC<CourseAdministrationViewProps> = ({ workshop }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Course Administration
      </h3>
      <div className="space-y-4">
        <div>
          <Label>BIA Level</Label>
          <div className="flex space-x-4 mt-2">
            <Radio
              id="bia-basic-view"
              name="bia-level-view"
              value="basic"
              checked={workshop.bia_level?.toLowerCase() === "basic"}
              label="Basic"
              onChange={() => {}}
              disabled={true}
            />
            <Radio
              id="bia-intermediate-view"
              name="bia-level-view"
              value="intermediate"
              checked={workshop.bia_level?.toLowerCase() === "intermediate"}
              label="Intermediate"
              onChange={() => {}}
              disabled={true}
            />
            <Radio
              id="bia-advanced-view"
              name="bia-level-view"
              value="advanced"
              checked={workshop.bia_level?.toLowerCase() === "advanced"}
              label="Advanced"
              onChange={() => {}}
              disabled={true}
            />
            <Radio
              id="bia-none-view"
              name="bia-level-view"
              value="none"
              checked={!workshop.bia_level || workshop.bia_level === "Not specified"}
              label="Not specified"
              onChange={() => {}}
              disabled={true}
            />
          </div>
        </div>
        <div>
          <Label>Subsidy Description</Label>
          <Input
            type="text"
            value={workshop.subsidy_description || "No subsidy information"}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};