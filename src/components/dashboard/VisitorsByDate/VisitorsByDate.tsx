"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTimelineData } from "@/hooks/learningJourney/DashboardComponents/useTimelineData";
import { getTimelineChartOptions } from "@/config/LearningJourneyDashboardConfig/timelineChartOptions";
import { getChartSubtitle, getChartTitle } from "@/utils/LearningJourneyDashboardUtils/VisitorsByDateUtils/timelineChartHelpers";
import { TimelineChartLoadingSkeleton } from "./TimelineChartLoadingSkeleton";
import { TimelineChartErrorState } from "./TimelineChartErrorState";
import { TimelineChartHeader } from "./TimelineChartHeader";
import { TimelineChartEmptyState } from "./TimelineChartEmptyState";
import { TimelineStatsSingle } from "./TimelineStatsSingle";
import { TimelineStatsComparison } from "./TimelineStatsComparison";
import { ChartType } from "@/types/LearningJourneyDashboardTypes/visitorsTimeline";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function VisitorsByDate() {
  const [chartType, setChartType] = useState<ChartType>("area");

  const {
    primarySeries,
    comparisonSeries,
    categories,
    totalVisitors,
    averagePerVisit,
    comparisonTotalVisitors,
    comparisonAveragePerVisit,
    peakVisit,
    comparisonPeakVisit,
    isLoading,
    error,
    getPeriodLabel,
    currentPeriod,
    comparisonPeriod,
    isComparisonMode,
  } = useTimelineData();

  const chartTitle = getChartTitle(isComparisonMode, comparisonPeriod, getPeriodLabel);
  const chartSubtitle = getChartSubtitle(
    categories,
    primarySeries,
    comparisonSeries,
    isComparisonMode,
    comparisonPeriod,
    currentPeriod,
    getPeriodLabel
  );

  const chartOptions = getTimelineChartOptions({
    chartType,
    categories,
    isComparisonMode,
  });

  const series = useMemo(() => {
    const result = [{ 
      name: isComparisonMode ? getPeriodLabel() : "Visitors", 
      data: primarySeries 
    }];

    if (isComparisonMode && comparisonSeries.length > 0) {
      result.push({
        name: getPeriodLabel(comparisonPeriod),
        data: comparisonSeries
      });
    }

    return result;
  }, [primarySeries, comparisonSeries, isComparisonMode, comparisonPeriod, getPeriodLabel]);

  if (isLoading) {
    return <TimelineChartLoadingSkeleton />;
  }

  if (error) {
    return <TimelineChartErrorState error={error} />;
  }

  const hasData = primarySeries.length > 0;
  const hasComparisonData = isComparisonMode && comparisonSeries.length > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <TimelineChartHeader
        title={chartTitle}
        subtitle={chartSubtitle}
        chartType={chartType}
        onChartTypeChange={setChartType}
      />

      <div className="max-w-full overflow-x-auto custom-scrollbar lg:overflow-x-hidden">
        <div className="min-w-[1000px] xl:min-w-full">
          {hasData ? (
            <ReactApexChart 
              options={chartOptions} 
              series={series} 
              type={chartType} 
              height={310} 
            />
          ) : (
            <TimelineChartEmptyState periodLabel={getPeriodLabel()} />
          )}
        </div>
      </div>

      {hasData && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          {isComparisonMode ? (
            <TimelineStatsComparison
              primaryVisits={primarySeries.filter(v => v > 0).length}
              comparisonVisits={comparisonSeries.filter(v => v > 0).length}
              totalVisitors={totalVisitors}
              comparisonTotalVisitors={comparisonTotalVisitors}
              averagePerVisit={averagePerVisit}
              comparisonAveragePerVisit={comparisonAveragePerVisit}
              peakVisit={peakVisit}
              comparisonPeakVisit={comparisonPeakVisit}
              hasComparisonData={hasComparisonData}
            />
          ) : (
            <TimelineStatsSingle
              totalVisits={primarySeries.filter(v => v > 0).length}
              totalVisitors={totalVisitors}
              averagePerVisit={averagePerVisit}
              peakVisit={peakVisit}
            />
          )}
        </div>
      )}
    </div>
  );
}