import React from "react";
import Badge from "@/components/ui/badge/Badge";

interface VisitorsChartBadgeProps {
  isComparisonMode: boolean;
  percentageChange?: string;
  attendanceStatus?: string;
}

export const VisitorsChartBadge = ({
  isComparisonMode,
  percentageChange,
  attendanceStatus,
}: VisitorsChartBadgeProps) => {
  if (isComparisonMode && percentageChange) {
    return (
      <div className="absolute left-1/2 top-full -translate-x-1/2">
        <Badge
          variant="light"
          color={parseFloat(percentageChange) >= 0 ? "success" : "error"}
          size="sm"
        >
          {parseFloat(percentageChange) >= 0 ? `+${percentageChange}%` : `${percentageChange}%`}
        </Badge>
      </div>
    );
  }

  if (!isComparisonMode && attendanceStatus) {
    return (
      <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] mt-6">
        <Badge variant="light" color="primary" size="sm">
          {attendanceStatus}
        </Badge>
      </div>
    );
  }

  return null;
};