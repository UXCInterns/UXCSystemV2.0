// Main status distribution chart component
// Displays a donut chart showing workforce availability status (Available, Busy, Overloaded)
// with interactive hover states and detailed legend
"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useStatusDistribution } from "@/hooks/ManpowerHooks/useStatusDistribution";
import { getStatusChartOptions } from "@/config/ManpowerConfig/statusChartOptions";
import { StatusChartLoadingSkeleton } from "./StatusChartLoadingSkeleton";
import { StatusLegend } from "./StatusLegend";
import { EmptyChartState } from "../RoleDistributionChart/EmptyChartState";
import { ChartHeader } from "../RoleDistributionChart/ChartHeader";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StatusDistributionChart = () => {
  const {
    statusData,
    totalPeople,
    loading,
    hoveredValue,
    hoveredLabel,
    handleDataPointMouseEnter,
    handleDataPointMouseLeave,
  } = useStatusDistribution();

  if (loading) {
    return <StatusChartLoadingSkeleton />;
  }

  const hasData = statusData.length > 0 && totalPeople > 0;
  const chartLabels = statusData.map(item => item.status);
  const chartSeries = statusData.map(item => item.count);

  const chartOptions = getStatusChartOptions({
    labels: chartLabels,
    series: chartSeries,
    hoveredLabel,
    hoveredValue,
    totalPeople,
    onDataPointMouseEnter: handleDataPointMouseEnter,
    onDataPointMouseLeave: handleDataPointMouseLeave,
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <ChartHeader
        title="Status Distribution"
        subtitle="Workforce availability overview"
      />

      {hasData ? (
        <div className="flex flex-col items-center gap-6 xl:flex-row">
          <div className="w-58 relative">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={280}
            />
          </div>

          <StatusLegend 
            statusData={statusData} 
            totalPeople={totalPeople} 
          />
        </div>
      ) : (
        <EmptyChartState message="No status distribution data available" />
      )}
    </div>
  );
};

export default StatusDistributionChart;