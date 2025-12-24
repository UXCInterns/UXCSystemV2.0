import React from "react";
import DetailsSection from "./DetailsSection";
import MetricCard from "@/components/ui/metric/MetricCard";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";
import { calculateAttendanceRate } from "@/utils/LearningJourneyAttendanceUtils/ViewDetailsModalUtils/formatUtils";

interface AttendanceMetricsDisplayProps {
  visit: Visit;
}

const AttendanceMetricsDisplay: React.FC<AttendanceMetricsDisplayProps> = ({ visit }) => {
  const attendanceRate = calculateAttendanceRate(visit.total_attended, visit.total_registered);

  return (
    <DetailsSection title="Attendance Metrics">
      <div className="grid grid-cols-1 gap-4">
        <MetricCard
          label="Total Registered"
          value={visit.total_registered.toString()}
          colorClass="blue"
        />
        <MetricCard
          label="Total Attended"
          value={visit.total_attended.toString()}
          colorClass="green"
        />
        <MetricCard
          label="Attendance Rate"
          value={attendanceRate}
          colorClass="purple"
        />
      </div>
    </DetailsSection>
  );
};

export default AttendanceMetricsDisplay;