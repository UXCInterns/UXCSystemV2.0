"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";
import ChartTypeToggle from "../common/ChartTypeToggle";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Months for consistent ordering
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function VisitsComparison() {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    getPeriodLabel 
  } = usePeriod();
  
  const { startDate, endDate } = getPeriodRange();
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const params = useMemo(() => {
    const p = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });

    // Add comparison parameters if in comparison mode
    if (isComparisonMode && comparisonPeriod) {
      const comparisonRange = getPeriodRange(comparisonPeriod);
      p.append("isComparison", "true");
      p.append("comparisonStartDate", comparisonRange.startDate);
      p.append("comparisonEndDate", comparisonRange.endDate);
    }

    return p.toString();
  }, [startDate, endDate, currentPeriod.type, isComparisonMode, comparisonPeriod, getPeriodRange]);

  const { data, error, isLoading } = useSWR(
    `/api/learning-journey-dashboard?${params}`,
    fetcher,
    { refreshInterval: 30000 }
  );

  const { series, categories, summary, comparisonSummary } = useMemo(() => {
    const breakdown = data?.sessionTypeBreakdown || {};
    const comparisonBreakdown = data?.comparison?.sessionTypeBreakdown || {};
    
    if (Object.keys(breakdown).length === 0) {
      return { series: [], categories: [], summary: { total: 0, peak: "—" }, comparisonSummary: null };
    }

    // Helper function to process session data
    const processSessionData = (sessionBreakdown: any, periodType: string) => {
      let labels: string[] = [];
      let paceData: number[] = [];
      let informalData: number[] = [];

      if (periodType === "custom") {
        // For custom date ranges, use chronological order
        const customData: { date: Date; month: string; pace: number; informal: number }[] = [];
        
        Object.entries(sessionBreakdown).forEach(([monthKey, data]: [string, any]) => {
          const [monthName, year] = monthKey.split(" ");
          const monthIndex = MONTHS.indexOf(monthName);
          if (monthIndex !== -1) {
            customData.push({
              date: new Date(parseInt(year), monthIndex),
              month: monthName,
              pace: data.pace || 0,
              informal: data.informal || 0
            });
          }
        });

        // Sort by date
        customData.sort((a, b) => a.date.getTime() - b.date.getTime());
        
        labels = customData.map(d => d.month);
        paceData = customData.map(d => d.pace);
        informalData = customData.map(d => d.informal);

      } else if (periodType === "quarterly") {
        // For quarterly, use the actual month names from the data
        const quarterData: { month: string; pace: number; informal: number }[] = [];
        
        Object.entries(sessionBreakdown).forEach(([monthKey, data]: [string, any]) => {
          const monthName = monthKey.split(" ")[0];
          quarterData.push({
            month: monthName,
            pace: data.pace || 0,
            informal: data.informal || 0
          });
        });

        // Sort by month order for quarters
        quarterData.sort((a, b) => MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month));
        
        labels = quarterData.map(d => d.month);
        paceData = quarterData.map(d => d.pace);
        informalData = quarterData.map(d => d.informal);

      } else if (periodType === "financial") {
        // For financial year: Apr-Mar order
        const finLabels = [
          "Apr", "May", "Jun", "Jul", "Aug", "Sep",
          "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
        ];
        
        const yearlyPaceData = Array(12).fill(0);
        const yearlyInformalData = Array(12).fill(0);

        Object.entries(sessionBreakdown).forEach(([monthKey, data]: [string, any]) => {
          const monthName = monthKey.split(" ")[0];
          const monthIndex = MONTHS.indexOf(monthName);
          if (monthIndex !== -1) {
            const finIndex = (monthIndex + 9) % 12; // Convert to financial year index
            yearlyPaceData[finIndex] = data.pace || 0;
            yearlyInformalData[finIndex] = data.informal || 0;
          }
        });

        labels = finLabels;
        paceData = yearlyPaceData;
        informalData = yearlyInformalData;

      } else {
        // Default calendar year: Jan-Dec
        const yearlyPaceData = Array(12).fill(0);
        const yearlyInformalData = Array(12).fill(0);

        Object.entries(sessionBreakdown).forEach(([monthKey, data]: [string, any]) => {
          const monthName = monthKey.split(" ")[0];
          const monthIndex = MONTHS.indexOf(monthName);
          if (monthIndex !== -1) {
            yearlyPaceData[monthIndex] = data.pace || 0;
            yearlyInformalData[monthIndex] = data.informal || 0;
          }
        });

        labels = MONTHS;
        paceData = yearlyPaceData;
        informalData = yearlyInformalData;
      }

      const totals = paceData.map((v, i) => v + informalData[i]);
      const total = totals.reduce((a, b) => a + b, 0);
      const maxTotal = Math.max(...totals);
      const peakIdx = totals.indexOf(maxTotal);

      return {
        labels,
        paceData,
        informalData,
        total,
        peak: maxTotal > 0 ? `${labels[peakIdx]} (${maxTotal})` : "—"
      };
    };

    // Process primary period data
    const primaryData = processSessionData(breakdown, currentPeriod.type);
    
    let seriesData;
    let comparisonSummary = null;

    if (isComparisonMode && Object.keys(comparisonBreakdown).length > 0) {
      // Process comparison data
      const compData = processSessionData(comparisonBreakdown, comparisonPeriod?.type || currentPeriod.type);
      
      // Create series for comparison mode
      seriesData = [
        { name: "Pace", data: primaryData.paceData },
        { name: "Informal", data: primaryData.informalData },
        { name: "Comparison Pace", data: compData.paceData },
        { name: "Comparison Informal", data: compData.informalData },
      ];

      comparisonSummary = {
        total: compData.total,
        peak: compData.peak
      };
    } else {
      // Regular mode series
      seriesData = [
        { name: "Pace", data: primaryData.paceData },
        { name: "Informal", data: primaryData.informalData },
      ];
    }

    return {
      categories: primaryData.labels,
      series: seriesData,
      summary: {
        total: primaryData.total,
        peak: primaryData.peak,
      },
      comparisonSummary
    };
  }, [data, currentPeriod.type, isComparisonMode, comparisonPeriod]);

  const getChartTitle = () => {
    const baseTitle = "Pace vs Informal";

    if (isComparisonMode && comparisonPeriod) {
      return `${baseTitle} - Comparison`;
    }

    switch (currentPeriod.type) {
      case "quarterly":
        return `${baseTitle} (${getPeriodLabel()})`;
      case "financial":
        return `${baseTitle} (Financial Year ${currentPeriod.year}-${currentPeriod.year + 1})`;
      case "custom":
        return `${baseTitle} (Custom Range)`;
      default:
        return `${baseTitle} (${currentPeriod.year})`;
    }
  };

  const getSubtitle = () => {
    if (isComparisonMode && comparisonPeriod) {
      return `${getPeriodLabel()} vs ${getPeriodLabel(comparisonPeriod)}`;
    }
    return getPeriodLabel();
  };

  // Chart colors for comparison mode
  const chartColors = isComparisonMode ? 
    ["#465FFF", "#9CB9FF", "#FF6B6B", "#FFB3B3"] : 
    ["#465FFF", "#9CB9FF"];

  const options: ApexOptions = {
    legend: { 
      show: isComparisonMode,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "12px",
      markers: {size: 8}
    },
    colors: chartColors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: isComparisonMode ? 200 : 195,
      type: chartType,
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
    },
    stroke: { 
      curve: "straight", 
      width: chartType === "bar" ? 0 : 2 
    },
    fill: { 
      type: chartType === "area" ? "gradient" : "solid",
      gradient: { opacityFrom: 0.55, opacityTo: 0 } 
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: isComparisonMode ? 20 : 0 }
    },
    dataLabels: { enabled: false },
    tooltip: { 
      enabled: true,
      shared: true,
      intersect: false,
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { 
        style: { fontSize: "12px", colors: ["#6B7280"] },
        formatter: (val: number) => Math.round(val).toString()
      },
    },
    noData: {
      text: "No visits recorded for this period",
      align: "center",
      verticalAlign: "middle",
      style: { color: "#6B7280", fontSize: "16px" },
    },
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className={`${isComparisonMode ? 'h-[250px]' : 'h-[147px]'} flex items-center justify-center text-gray-500 dark:text-gray-400`}>
          Loading chart...
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
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {getChartTitle()}
          </h3>
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">
            {getSubtitle()}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <ChartTypeToggle selectedType={chartType} onChange={setChartType} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar lg:overflow-x-hidden lg:overflow-y-hidden">
        <div className="min-w-[1000px] xl:min-w-full">
          {series.length > 0 && series.some(s => s.data.some(d => d > 0)) ? (
            <ReactApexChart
              options={options}
              series={series}
              type={chartType}
              height={isComparisonMode ? 197 : 195}
            />
          ) : (
            <div className={`${isComparisonMode ? 'h-[210px]' : 'h-[210px]'} flex items-center justify-center text-gray-400`}>
              No data for {getPeriodLabel()}
            </div>
          )}
        </div>
      </div>

      {/* Always show summary section, even with zero data */}
      <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
        {isComparisonMode && comparisonSummary ? (
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Total Visitors:{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {summary.total}
              </span>
              <span className="text-red-500 text-xs font-medium mx-1">vs {comparisonSummary.total}</span>
            </span>
            <span>
              Peak:{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {summary.peak}
              </span>
              <span className="text-red-500 text-xs font-medium mx-1">vs {comparisonSummary.peak}</span>
            </span>
          </div>
        ) : (
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Total Period Visitors:{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {summary.total}
              </span>
            </span>
            <span>
              Peak Month:{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {summary.peak}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}