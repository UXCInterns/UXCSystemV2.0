"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";
import { useMemo } from "react";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Months for x-axis
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
];

// SWR fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function VisitorsByMonth() {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    getPeriodLabel 
  } = usePeriod();

  const { startDate, endDate } = getPeriodRange();

  const params = useMemo(() => {
    const p = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });

    // Add comparison parameters if comparison mode is enabled
    if (isComparisonMode && comparisonPeriod) {
      const comparisonRange = getPeriodRange(comparisonPeriod);
      p.append('isComparison', 'true');
      p.append('comparisonStartDate', comparisonRange.startDate);
      p.append('comparisonEndDate', comparisonRange.endDate);
    }

    return p.toString();
  }, [startDate, endDate, currentPeriod.type, isComparisonMode, comparisonPeriod, getPeriodRange]);

  const { data, error, isLoading } = useSWR(`/api/learning-journey-dashboard?${params}`, fetcher, {
    refreshInterval: 30000, // auto-refresh every 30s
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const { primaryData, comparisonData, labels } = useMemo(() => {
    const processBreakdown = (breakdown: any[], type: string): { processedData: number[], labels: string[] } => {
      if (!breakdown) return { processedData: [], labels: MONTHS };

      if (type === "quarterly") {
        const quarterData: number[] = [];
        const quarterLabels: string[] = [];

        breakdown.forEach((item: any) => {
          if (item.monthName && typeof item.total === "number") {
            quarterLabels.push(item.monthName);
            quarterData.push(item.total);
          }
        });

        while (quarterLabels.length < 3) {
          quarterLabels.push("N/A");
          quarterData.push(0);
        }

        return { processedData: quarterData, labels: quarterLabels };
      }

      if (type === "financial") {
        const yearlyData = Array(12).fill(0) as number[];
        const finLabels = [
          "Apr", "May", "Jun", "Jul", "Aug", "Sept",
          "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
        ];

        breakdown.forEach((item: any) => {
          if (item.monthName && typeof item.total === "number") {
            const monthIndex = MONTHS.indexOf(item.monthName);
            if (monthIndex !== -1) {
              const finIndex = (monthIndex + 9) % 12;
              yearlyData[finIndex] = item.total;
            }
          }
        });

        return { processedData: yearlyData, labels: finLabels };
      }

      if (type === "custom") {
        // For custom date ranges, show data by month name from the breakdown
        const customData: number[] = [];
        const customLabels: string[] = [];

        breakdown.forEach((item: any) => {
          if (item.monthName && typeof item.total === "number") {
            customLabels.push(item.monthName);
            customData.push(item.total);
          }
        });

        return { processedData: customData, labels: customLabels };
      }

      // Default calendar year
      const yearlyData = Array(12).fill(0) as number[];
      breakdown.forEach((item: any) => {
        if (item.monthName && typeof item.total === "number") {
          const monthIndex = MONTHS.indexOf(item.monthName);
          if (monthIndex !== -1) yearlyData[monthIndex] = item.total;
        }
      });

      return { processedData: yearlyData, labels: MONTHS };
    };

    const primaryResult = processBreakdown(data?.periodBreakdown, currentPeriod.type);
    let comparisonResult: { processedData: number[], labels: string[] } = { processedData: [], labels: [] };

    if (isComparisonMode && data?.comparison?.periodBreakdown) {
      comparisonResult = processBreakdown(
        data.comparison.periodBreakdown, 
        comparisonPeriod?.type || currentPeriod.type
      );
    }

    return {
      primaryData: primaryResult.processedData,
      comparisonData: comparisonResult.processedData,
      labels: primaryResult.labels
    };
  }, [data, currentPeriod.type, comparisonPeriod?.type, isComparisonMode]);

  const getChartTitle = () => {
    if (isComparisonMode && comparisonPeriod) {
      return `Visitors by Month - Comparison`;
    }

    switch (currentPeriod.type) {
      case "quarterly":
        return `Visitors by Month (${getPeriodLabel()})`;
      case "financial":
        return `Visitors by Month (Financial Year ${currentPeriod.year}-${currentPeriod.year + 1})`;
      case "custom":
        return `Visitors by Month (Custom Range)`;
      default:
        return `Visitors by Month (${currentPeriod.year})`;
    }
  };

  const getSubtitle = () => {
    if (isComparisonMode && comparisonPeriod) {
      return `${getPeriodLabel()} vs ${getPeriodLabel(comparisonPeriod)}`;
    }
    return getPeriodLabel();
  };

  const options: ApexOptions = {
    colors: isComparisonMode && comparisonData.length > 0 
      ? ["#465fff", "#FF6B6B"] 
      : ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 198,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: currentPeriod.type === "quarterly" ? "60%" : "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => (val > 0 ? `${val}` : ""),
      offsetY: -20,
      style: { fontSize: "12px", colors: ["#A1A1AA"] },
    },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit",
      markers: {size: 8}
    },
    yaxis: {
      title: { text: undefined },
      labels: { formatter: (val: number) => Math.round(val).toString() },
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: { 
      x: { show: false }, 
      y: { formatter: (val: number) => `${val} visitors` },
    },
    noData: {
      text: "No data available for this period",
      align: "center",
      verticalAlign: "middle",
      style: { color: "#6B7280", fontSize: "14px" },
    },
  };

  const series = useMemo(() => {
    const result = [{ name: "Primary Period", data: primaryData }];
    
    if (isComparisonMode && comparisonData.length > 0) {
      result.push({ name: "Comparison Period", data: comparisonData });
    }
    
    return result;
  }, [primaryData, comparisonData, isComparisonMode]);

  // Calculate totals and peak months
  const primaryTotal = primaryData.reduce((sum, val) => sum + val, 0);
  const comparisonTotal  = comparisonData.reduce((sum, val) => sum + val, 0);
  const primaryPeakIndex = primaryData.indexOf(Math.max(...primaryData));
  const comparisonPeakIndex = comparisonData.length > 0 ? comparisonData.indexOf(Math.max(...comparisonData)) : -1;

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between w-auto mb-4">
          <div>
            <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-auto pl-2 h-[198px] flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">
          Failed to load chart: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between w-auto">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {getChartTitle()}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {getSubtitle()}
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-auto pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={198}
          />
        </div>
      </div>

      <div className="pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
        {isComparisonMode && comparisonData.length > 0 ? (
          // Comparison mode footer
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          {/* Primary Period - Left */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded bg-blue-500"></div>
            <div>
              Primary Peak Month:{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {primaryData.length > 0 && Math.max(...primaryData) > 0
                  ? labels[primaryPeakIndex] || "N/A"
                  : "N/A"}
              </span>
            </div>
          </div>

          {/* Comparison Period - Right */}
          <div className="flex items-center gap-2 justify-end">
            <div className="w-2 h-2 rounded bg-error-400"></div>
            <div>
              Comparison Peak Month:{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {comparisonData.length > 0 && Math.max(...comparisonData) > 0
                  ? labels[comparisonPeakIndex] || "N/A"
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
        ) : (
          // Single mode footer
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Total Period Visitors:{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {primaryTotal}
              </span>
            </span>
            <span>
              Peak Month:{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {primaryData.length > 0 && Math.max(...primaryData) > 0
                  ? labels[primaryPeakIndex] || "N/A"
                  : "N/A"}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}