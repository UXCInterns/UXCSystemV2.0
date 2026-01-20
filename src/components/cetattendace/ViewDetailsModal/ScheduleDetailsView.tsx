import React from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

interface Workshop {
  program_start_date: string;
  program_end_date: string;
  course_hours: number;
}

interface ScheduleDetailsViewProps {
  workshop: Workshop;
}

export const ScheduleDetailsView: React.FC<ScheduleDetailsViewProps> = ({ workshop }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calculateDuration = () => {
    const startDate = new Date(workshop.program_start_date);
    const endDate = new Date(workshop.program_end_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? "1 day" : `${diffDays + 1} days`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-md sm:text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Schedule Details
      </h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Start Date</Label>
            <Input
              type="text"
              value={formatDate(workshop.program_start_date)}
              disabled={true}
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type="text"
              value={formatDate(workshop.program_end_date)}
              disabled={true}
            />
          </div>
        </div>
        <div>
          <Label>Duration</Label>
          <Input
            type="text"
            value={calculateDuration()}
            disabled={true}
          />
        </div>
        <div>
          <Label>Course Hours</Label>
          <Input
            type="text"
            value={`${workshop.course_hours} hours`}
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
};