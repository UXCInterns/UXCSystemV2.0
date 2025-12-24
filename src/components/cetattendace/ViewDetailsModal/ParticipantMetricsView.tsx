import React from "react";
import MetricCard from "@/components/ui/metric/MetricCard";

interface Workshop {
  no_of_participants: number;
  company_sponsored_participants: number;
  individual_group_participants?: number;
  trainee_hours: number;
}

interface ParticipantMetricsViewProps {
  workshop: Workshop;
}

export const ParticipantMetricsView: React.FC<ParticipantMetricsViewProps> = ({ workshop }) => {
  const individualGroupCount =
    workshop.individual_group_participants ??
    workshop.no_of_participants - workshop.company_sponsored_participants;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
        Participant Metrics
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {/* Total Participants */}
        <MetricCard
          label="Total Participants"
          value={workshop.no_of_participants}
          colorClass="blue"
        />

        {/* Company Sponsored + Individual Group */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="Company Sponsored"
            value={workshop.company_sponsored_participants}
            colorClass="green"
          />

          <MetricCard
            label="Individual/Group"
            value={individualGroupCount}
            colorClass="purple"
          />
        </div>

        {/* Trainee Hours */}
        <MetricCard
          label="Total Trainee Hours"
          value={workshop.trainee_hours}
          suffix="hours"
          colorClass="amber"
        />
      </div>
    </div>
  );
};
