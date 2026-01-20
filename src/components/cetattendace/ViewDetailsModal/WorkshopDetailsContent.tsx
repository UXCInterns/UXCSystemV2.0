import React from "react";
import { ProgramInformationView } from "./ProgramInformationView";
import { ScheduleDetailsView } from "./ScheduleDetailsView";
import { ParticipantMetricsView } from "./ParticipantMetricsView";
import { CourseAdministrationView } from "./CourseAdministrationView";
import { LearningOutcomesView } from "./LearningOutcomesView";
import { MetadataFooter } from "./MetadataFooter";

interface Workshop {
  id: string;
  course_program_title: string;
  program_start_date: string;
  program_end_date: string;
  no_of_participants: number;
  trainee_hours: number;
  program_type: string;
  school_dept: string;
  course_hours: number;
  company_sponsored_participants: number;
  run_number?: string;
  individual_group_participants?: number;
  course_type?: string;
  subsidy_description?: string;
  bia_level?: string;
  learning_outcome?: string;
  category?: string;
  csc?: boolean;
  created_at: string;
  updated_at: string;
}

interface WorkshopDetailsContentProps {
  workshop: Workshop;
}

export const WorkshopDetailsContent: React.FC<WorkshopDetailsContentProps> = ({ workshop }) => {
  return (
    <>
      {/* Mobile Layout - Single Column */}
      <div className="md:hidden space-y-6">
        <ProgramInformationView workshop={workshop} />
        <ScheduleDetailsView workshop={workshop} />
        <ParticipantMetricsView workshop={workshop} />
        <CourseAdministrationView workshop={workshop} />
        <LearningOutcomesView workshop={workshop} />
        <MetadataFooter workshop={workshop} />
      </div>

      {/* Desktop Layout - Two Column Grid */}
      <div className="hidden md:block flex-1 max-h-[55vh] overflow-y-auto custom-scrollbar px-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <ProgramInformationView workshop={workshop} />
            <ScheduleDetailsView workshop={workshop} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ParticipantMetricsView workshop={workshop} />
            <CourseAdministrationView workshop={workshop} />
          </div>
        </div>

        <LearningOutcomesView workshop={workshop} />
        <MetadataFooter workshop={workshop} />
      </div>
    </>
  );
};