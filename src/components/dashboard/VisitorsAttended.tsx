"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// SWR fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function VisitorsAttended() {
  const { getPeriodRange, currentPeriod, getPeriodLabel } = usePeriod();
  const maxValue = 1000; // Define a maximum value for the radial bar

  const { startDate, endDate } = getPeriodRange();
  const params = new URLSearchParams({
    startDate,
    endDate,
    periodType: currentPeriod.type,
  });

  // SWR hook for fetching metrics
  const { data, error, isLoading } = useSWR(`/api/learning-journey-dashboard?${params}`, fetcher, {
    refreshInterval: 30000, // optional: auto-refresh every 30s
  });

  const totalVisitors = data?.totalVisitors || 0;

  // Calculate previous period visitors from API comparisonMetrics
  const previousPeriodVisitors = data?.comparisonMetrics?.totalVisitorsChange
    ? Math.round(
        totalVisitors /
          (1 + parseFloat(data.comparisonMetrics.totalVisitorsChange) / 100)
      )
    : 0;

  const difference = totalVisitors - previousPeriodVisitors;
  const diffPercent =
    previousPeriodVisitors > 0
      ? ((difference / previousPeriodVisitors) * 100).toFixed(1)
      : "0";

  const progress =
    previousPeriodVisitors > 0
      ? (totalVisitors / previousPeriodVisitors) * 100
      : totalVisitors > 0
      ? 100
      : 0;

  // const series = [Math.min(progress, 100)]; // cap at 100%
   const series = [(totalVisitors / maxValue) * 100];

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -95,
        endAngle: 95,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: {
            show: true,
            offsetY: 10,
            color: "#1D2939",
            fontSize: "16px",
            fontWeight: "600",
          },
          value: {
            fontSize: "60px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: () => (isLoading ? "..." : `${totalVisitors}`),
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Visitors Attended"],
  };

  const getPeriodComparisonLabel = () => {
    switch (currentPeriod.type) {
      case "calendar":
        return `previous calendar year`;
      case "financial":
        return `previous financial year`;
      case "quarterly":
        return `previous quarter`;
      default:
        return `previous period`;
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.00] animate-pulse h-[350px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-5">
        <p className="text-red-600 dark:text-red-400">
          Failed to load metrics: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.00]">
      <div className="px-5 pt-5 bg-white shadow-default border-b border-gray-200 dark:border-gray-800 rounded-2xl pb-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Visitors Attended
            </h3>
            <p className="font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Total visitors attended - {getPeriodLabel()}
            </p>
          </div>
        </div>
        <div className="relative">
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={330}
          />
          <span
            className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium mt-6 ${
              difference >= 0
                ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                : "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500"
            }`}
          >
            {difference >= 0 ? `+${diffPercent}%` : `${diffPercent}%`}
          </span>
        </div>
        <p className="mx-auto mt-8 w-full max-w-[360px] text-center text-sm text-gray-500 sm:text-base">
          We have{" "}
          {difference >= 0
            ? `${difference} more visitors than the ${getPeriodComparisonLabel()}. Good job!`
            : `${Math.abs(difference)} fewer visitors than the ${getPeriodComparisonLabel()}. Keep fighting!`}
        </p>
      </div>
    </div>
  );
}
