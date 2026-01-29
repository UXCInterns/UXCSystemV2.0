"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { useMonthlyVisitors } from "@/hooks/learningJourney/DashboardComponents/useMonthlyVisitors";
import { getMonthlyChartOptions } from "@/config/LearningJourneyDashboardConfig/monthlyChartOptions";
import { 
  getMonthlyChartTitle, 
  getMonthlyChartSubtitle,
  calculatePeakMonth,
  calculateTotal
} from "@/utils/LearningJourneyDashboardUtils/VisitorsByMonthUtils/monthlyChartHelpers";
import { MonthlyChartLoadingSkeleton } from "./MonthlyChartLoadingSkeleton";
import { MonthlyChartErrorState } from "./MonthlyChartErrorState";
import { MonthlyChartHeader } from "./MonthlyChartHeader";
import { MonthlyChartFooterSingle } from "./MonthlyChartFooterSingle";
import { MonthlyChartFooterComparison } from "./MonthlyChartFooterComparison";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function VisitorsByMonth() {
  const {
    primaryData,
    comparisonData,
    labels,
    isLoading,
    error,
    getPeriodLabel,
    currentPeriod,
    comparisonPeriod,
    isComparisonMode,
  } = useMonthlyVisitors();

  const chartTitle = getMonthlyChartTitle(
    isComparisonMode,
    comparisonPeriod ?? null,
    currentPeriod,
    getPeriodLabel
  );

  const chartSubtitle = getMonthlyChartSubtitle(
    isComparisonMode,
    comparisonPeriod ?? null,
    getPeriodLabel
  );

  const chartOptions = getMonthlyChartOptions({
    labels,
    isComparisonMode,
    hasComparisonData: comparisonData.length > 0,
    periodType: currentPeriod.type,
  });

  const series = useMemo(() => {
    const result = [{ name: "Primary Period", data: primaryData }];
    
    if (isComparisonMode && comparisonData.length > 0) {
      result.push({ name: "Comparison Period", data: comparisonData });
    }
    
    return result;
  }, [primaryData, comparisonData, isComparisonMode]);

  const primaryTotal = calculateTotal(primaryData);
  const primaryPeakMonth = calculatePeakMonth(primaryData, labels);
  const comparisonPeakMonth = calculatePeakMonth(comparisonData, labels);

  if (isLoading) {
    return <MonthlyChartLoadingSkeleton />;
  }

  if (error) {
    return <MonthlyChartErrorState error={error} />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <MonthlyChartHeader title={chartTitle} subtitle={chartSubtitle} />

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-auto pl-2">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="bar"
            height={198}
          />
        </div>
      </div>

      <div className="pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
        {isComparisonMode && comparisonData.length > 0 ? (
          <MonthlyChartFooterComparison
            primaryPeakMonth={primaryPeakMonth}
            comparisonPeakMonth={comparisonPeakMonth}
          />
        ) : (
          <MonthlyChartFooterSingle
            totalVisitors={primaryTotal}
            peakMonth={primaryPeakMonth}
          />
        )}
      </div>
    </div>
  );
}