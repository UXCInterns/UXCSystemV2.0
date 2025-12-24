import React from "react";
import Label from "@/components/form/Label";
import Radio from "@/components/form/input/Radio";
import Input from "@/components/form/input/InputField";

interface Workshop {
  school_dept: string;
  course_type?: string;
  run_number?: string;
  program_type: string;
  category?: string;
  csc?: boolean;
}

interface ProgramInformationViewProps {
  workshop: Workshop;
}

export const ProgramInformationView: React.FC<ProgramInformationViewProps> = ({ workshop }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Program Information
      </h3>
      <div className="space-y-3">
        <div>
          <Label>School/Department</Label>
          <Input
            type="text"
            value={workshop.school_dept}
            disabled={true}
          />
        </div>
        <div>
          <Label>Course Type</Label>
          <Input
            type="text"
            value={workshop.course_type || "Not specified"}
            disabled={true}
          />
        </div>
        <div>
          <Label>Run Number</Label>
          <Input
            type="text"
            value={workshop.run_number || "Not specified"}
            disabled={true}
          />
        </div>
        {workshop.program_type === 'pace' && (
          <div>
            <Label>PACE Category</Label>
            <Input
              type="text"
              value={workshop.category || "Not specified"}
              disabled={true}
              className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            />
          </div>
        )}
        {workshop.program_type === 'non_pace' && (
          <div>
            <Label>CSC Eligible</Label>
            <div className="flex space-x-6 mt-2">
              <Radio
                id="csc-yes-view"
                name="csc-view"
                value="yes"
                checked={workshop.csc === true}
                label="Yes"
                onChange={() => {}}
                disabled={true}
              />
              <Radio
                id="csc-no-view"
                name="csc-view"
                value="no"
                checked={workshop.csc === false}
                label="No"
                onChange={() => {}}
                disabled={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};