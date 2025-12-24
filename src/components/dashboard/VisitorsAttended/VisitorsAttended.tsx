"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/context/ThemeContext";
import { useVisitorsMetrics } from "@/hooks/learningJourney/DashboardComponents/useVisitorsMetrics";
import { 
  calculatePercentageChange, 
  calculateDifference,
  getAttendanceStatus,
  getAttendanceMessage,
  calculateChartSeries
} from "@/utils/LearningJourneyDashboardUtils/VisitorsAttendedUtils/visitorsCalculations";
import { getVisitorsChartOptions } from "@/config/LearningJourneyDashboardConfig/visitorsChartOptions";
import { getPeriodComparisonLabel } from "@/utils/LearningJourneyDashboardUtils/VisitorsAttendedUtils/periodComparisonLabel";
import { MAX_VISITORS } from "@/constants/LearningJourneyDashboardConstants/visitorsConstants";
import { VisitorsChartLoadingSkeleton } from "./VisitorsChartLoadingSkeleton";
import { VisitorsChartErrorState } from "./VisitorsChartErrorState";
import { VisitorsChartHeader } from "./VisitorsChartHeader";
import { VisitorsChartBadge } from "./VisitorsChartBadge";
import { VisitorsSummaryText } from "./VisitorsSummaryText";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function VisitorsAttended() {
  const { theme } = useTheme();
  const {
    data,
    error,
    isLoading,
    getPeriodLabel,
    currentPeriod,
    comparisonPeriod,
    isComparisonMode,
  } = useVisitorsMetrics();

  if (isLoading) {
    return <VisitorsChartLoadingSkeleton />;
  }

  if (error) {
    return <VisitorsChartErrorState error={error} />;
  }

  const primaryVisitors = data?.totalVisitors || 0;
  const comparisonVisitors = data?.comparison?.totalVisitors || 0;

  const percentageChange = calculatePercentageChange(primaryVisitors, comparisonVisitors);
  const difference = calculateDifference(primaryVisitors, comparisonVisitors);
  const attendanceStatus = getAttendanceStatus(primaryVisitors);
  const attendanceMessage = getAttendanceMessage(primaryVisitors);

  const series = calculateChartSeries(
    primaryVisitors,
    comparisonVisitors,
    isComparisonMode,
    MAX_VISITORS
  );

  const trackBackgroundColor = theme === "dark" ? "#1D2939" : "#f1f3f6ff";
  const chartOptions = getVisitorsChartOptions({
    isComparisonMode,
    isLoading,
    maxValue: MAX_VISITORS,
    primaryVisitors,
    comparisonVisitors,
    trackBackgroundColor,
  });

  const comparisonLabel = getPeriodComparisonLabel(
    isComparisonMode,
    comparisonPeriod,
    currentPeriod,
    getPeriodLabel
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.00]">
      <div className="px-5 pt-5 bg-white shadow-default border-b border-gray-200 dark:border-gray-800 rounded-2xl pb-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <VisitorsChartHeader
          isComparisonMode={isComparisonMode}
          primaryLabel={getPeriodLabel()}
          comparisonLabel={comparisonPeriod ? getPeriodLabel(comparisonPeriod) : undefined}
        />

        <div className="relative">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="radialBar"
            height={330}
          />

          <VisitorsChartBadge
            isComparisonMode={isComparisonMode}
            percentageChange={percentageChange}
            attendanceStatus={attendanceStatus}
          />
        </div>

        <VisitorsSummaryText
          isComparisonMode={isComparisonMode}
          primaryVisitors={primaryVisitors}
          difference={difference}
          periodLabel={getPeriodLabel()}
          comparisonLabel={comparisonLabel}
          attendanceMessage={attendanceMessage}
        />
      </div>
    </div>
  );
}