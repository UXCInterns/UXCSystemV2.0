"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { usePeriod } from "@/context/PeriodContext";
import useSWR from "swr";
import { useMemo, useState } from "react";
import ChartTypeToggle from "../common/ChartTypeToggle";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TimelineEntry = {
  date: string; // e.g., "23 Aug 2025"
  total: number;
  company_name?: string;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function VisitorsByDate() {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    getPeriodLabel 
  } = usePeriod();
  
  const { startDate, endDate } = getPeriodRange();
  const comparisonRange = getPeriodRange(comparisonPeriod);
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const params = useMemo(() => {
    const p = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });

    // Add comparison parameters if comparison mode is enabled
    if (isComparisonMode && comparisonPeriod && comparisonRange) {
      p.append('isComparison', 'true');
      p.append('comparisonStartDate', comparisonRange.startDate);
      p.append('comparisonEndDate', comparisonRange.endDate);
    }

    return p.toString();
  }, [startDate, endDate, currentPeriod.type, isComparisonMode, comparisonPeriod, comparisonRange]);

  const { data, error, isLoading } = useSWR(`/api/learning-journey-dashboard?${params}`, fetcher, {
    refreshInterval: 30000, // auto-refresh every 30 seconds
  });

  const { 
    primarySeries, 
    comparisonSeries, 
    categories, 
    totalVisitors, 
    averagePerVisit,
    comparisonTotalVisitors,
    comparisonAveragePerVisit,
    peakVisit,
    comparisonPeakVisit
  } = useMemo(() => {
    const timeline: TimelineEntry[] = data?.timeline || [];
    const comparisonTimeline: TimelineEntry[] = data?.comparison?.timeline || [];

    if (timeline.length === 0 && (!isComparisonMode || comparisonTimeline.length === 0)) {
      return { 
        primarySeries: [], 
        comparisonSeries: [],
        categories: [], 
        totalVisitors: 0, 
        averagePerVisit: 0,
        comparisonTotalVisitors: 0,
        comparisonAveragePerVisit: 0,
        peakVisit: 0,
        comparisonPeakVisit: 0
      };
    }

    // Helper function to process timeline data without grouping duplicates
    const processTimelineData = (timelineData: TimelineEntry[]) => {
      if (timelineData.length === 0) return { entries: [], total: 0 };

      // Sort by date and time, keeping all individual entries
      const sorted = timelineData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      let total = 0;
      sorted.forEach(entry => {
        total += entry.total;
      });

      return { entries: sorted, total };
    };

    // Process both timelines keeping all individual entries
    const primary = processTimelineData(timeline);
    const comparison = isComparisonMode ? processTimelineData(comparisonTimeline) : { entries: [], total: 0 };

    let finalCategories: string[] = [];
    let primaryValues: number[] = [];
    let comparisonValues: number[] = [];

    if (!isComparisonMode) {
      // Single period mode - show all primary entries
      finalCategories = primary.entries.map(entry => entry.date);
      primaryValues = primary.entries.map(entry => entry.total);
    } else {
      // Comparison mode - create unified timeline with all entries from both periods
      const allEntries = [
        ...primary.entries.map((entry, index) => ({ ...entry, source: 'primary' as const, originalIndex: index })),
        ...comparison.entries.map((entry, index) => ({ ...entry, source: 'comparison' as const, originalIndex: index }))
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Create categories and values from all entries
      finalCategories = allEntries.map((entry, index) => {
        // Add index suffix for duplicate dates to make them distinguishable
        const sameDate = allEntries.filter(e => e.date === entry.date);
        if (sameDate.length > 1) {
          const occurrence = allEntries.slice(0, index + 1).filter(e => e.date === entry.date).length;
          return `${entry.date} (${occurrence})`;
        }
        return entry.date;
      });

      // Map values to the unified timeline
      primaryValues = [];
      comparisonValues = [];

      allEntries.forEach(entry => {
        if (entry.source === 'primary') {
          primaryValues.push(entry.total);
          comparisonValues.push(0);
        } else {
          primaryValues.push(0);
          comparisonValues.push(entry.total);
        }
      });
    }

    // Calculate statistics
    const primaryNonZeroValues = primaryValues.filter(v => v > 0);
    const comparisonNonZeroValues = comparisonValues.filter(v => v > 0);

    return {
      primarySeries: primaryValues,
      comparisonSeries: comparisonValues,
      categories: finalCategories,
      totalVisitors: primary.total,
      averagePerVisit: primaryNonZeroValues.length > 0 ? Math.round(primary.total / primaryNonZeroValues.length) : 0,
      comparisonTotalVisitors: comparison.total,
      comparisonAveragePerVisit: comparisonNonZeroValues.length > 0 ? Math.round(comparison.total / comparisonNonZeroValues.length) : 0,
      peakVisit: primaryValues.length > 0 ? Math.max(...primaryValues) : 0,
      comparisonPeakVisit: comparisonValues.length > 0 ? Math.max(...comparisonValues) : 0
    };
  }, [data, isComparisonMode]);

  console.log({ categories, primarySeries, comparisonSeries, totalVisitors, comparisonTotalVisitors });

  const getChartTitle = () => {
    if (isComparisonMode && comparisonPeriod) {
      return `Visitors Timeline Comparison`;
    }
    return `Visitors Timeline - ${getPeriodLabel()}`;
  };

  const getChartSubtitle = () => {
    if (categories.length === 0) return "No visits recorded for this period";

    if (isComparisonMode && comparisonPeriod) {
      const primaryDates = primarySeries.filter(v => v > 0).length;
      const comparisonDates = comparisonSeries.filter(v => v > 0).length;
      return `${getPeriodLabel()} vs ${getPeriodLabel(comparisonPeriod)}`;
    }

    const visitCount = primarySeries.filter(v => v > 0).length;
    switch (currentPeriod.type) {
      case 'quarterly':
        return `${visitCount} visits recorded in ${getPeriodLabel()}`;
      case 'financial':
        return `${visitCount} visits across financial year`;
      case 'custom':
        return `${visitCount} visits in selected date range`;
      default:
        return `${visitCount} individual visits by date`;
    }
  };

  const options: ApexOptions = {
    legend: { 
      show: isComparisonMode,
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: ['#374151', '#6B7280']
      }
    },
    colors: isComparisonMode 
      ? ["#465FFF", "#FF6B6B"] // Primary blue, Comparison red
      : ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: chartType,
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
    },
    stroke: { 
      curve: "smooth", 
      width: chartType === "bar" ? 0 : 2,
    },
    fill: {
      type: chartType === "area" ? "gradient" : "solid",
      gradient: { 
        opacityFrom: 0.55, 
        opacityTo: 0 
      }
    },
    markers: { 
      size: chartType === "area" ? 0 : 4, 
      strokeColors: "#fff", 
      strokeWidth: 2, 
      hover: { size: 6 } 
    },
    grid: { 
      xaxis: { lines: { show: false } }, 
      yaxis: { lines: { show: true } }, 
      padding: { right: 10, left: 10 } 
    },
    dataLabels: { enabled: false },
    tooltip: { 
      enabled: true
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: { 
        rotate: categories.length > 15 ? -45 : categories.length > 10 ? -35 : 0, 
        maxHeight: 150, 
        style: { fontSize: "11px" }
      },
    },
    yaxis: { 
      labels: { 
        style: { fontSize: "12px", colors: ["#6B7280"] }, 
        formatter: (val: number) => Math.round(val).toString() 
      } 
    },
    noData: { 
      text: "No visits recorded for this period", 
      align: "center", 
      verticalAlign: "middle", 
      style: { color: "#6B7280", fontSize: "16px" } 
    },
  };

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
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-5 mb-2 sm:flex-row sm:justify-between">
          <div className="w-full">
            <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full h-[310px] flex items-center justify-center">
            <div className="text-gray-500 dark:text-gray-400">Loading timeline chart...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Failed to load chart: {error.message}</p>
      </div>
    );
  }

  const hasData = primarySeries.length > 0;
  const hasComparisonData = isComparisonMode && comparisonSeries.length > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-2 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{getChartTitle()}</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">{getChartSubtitle()}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <ChartTypeToggle selectedType={chartType} onChange={setChartType} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar lg:overflow-x-hidden">
        <div className="min-w-[1000px] xl:min-w-full">
          {hasData ? (
            <ReactApexChart options={options} series={series} type={chartType} height={310} />
          ) : (
            <div className="h-[310px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">📅</div>
                <p className="text-gray-500 dark:text-gray-400">
                  No visits recorded for {getPeriodLabel().toLowerCase()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasData && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          {isComparisonMode ? (
            // Comparison Mode Stats
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Primary Visits</p>
                <div className="flex items-baseline justify-center gap-2">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {primarySeries.filter(v => v > 0).length}
                  </p>
                  {hasComparisonData && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">vs {comparisonSeries.filter(v => v > 0).length}</p>
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Primary Visitors</p>
                <div className="flex items-baseline justify-center gap-2">
                  <p className="text-xl font-bold text-yellow-600 dark:text-yellew-400">{totalVisitors}</p>
                  {hasComparisonData && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">vs {comparisonTotalVisitors}</p>
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Primary Avg</p>
                <div className="flex items-baseline justify-center gap-2">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">{averagePerVisit}</p>
                  {hasComparisonData && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">vs {comparisonAveragePerVisit}</p>
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Primary Peak</p>
                <div className="flex items-baseline justify-center gap-2">
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{peakVisit}</p>
                  {hasComparisonData && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">vs {comparisonPeakVisit}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Single Period Stats
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Total Visits</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{primarySeries.filter(v => v > 0).length}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Total Visitors</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalVisitors}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Avg per Visit</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{averagePerVisit}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Peak Visit</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{peakVisit}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}