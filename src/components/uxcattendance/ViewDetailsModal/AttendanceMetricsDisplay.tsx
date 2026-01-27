import React from "react";
import DetailsSection from "./DetailsSection";
import MetricCard from "@/components/ui/metric/MetricCard";
import { Visit } from "@/types/LearningJourneyAttendanceTypes/visit";
import { calculateAttendanceRate } from "@/utils/WorkshopAttendanceUtils/ViewDetailsModalUtils/formatUtils";

interface AttendanceMetricsDisplayProps {
  visit: Visit;
}

const AttendanceMetricsDisplay: React.FC<AttendanceMetricsDisplayProps> = ({ visit }) => {
  const totalRegistered = visit.total_registered ?? 0;
  const totalAttended = visit.total_attended ?? 0;
  const attendanceRate = calculateAttendanceRate(totalAttended, totalRegistered);

  return (
    <DetailsSection title="Attendance Metrics">
      <div className="grid grid-cols-1 gap-4">
        <MetricCard
          label="Total Registered"
          value={totalRegistered.toString()}
          colorClass="blue"
        />
        <MetricCard
          label="Total Attended"
          value={totalAttended.toString()}
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