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
  const { getPeriodRange, currentPeriod, getPeriodLabel } = usePeriod();
  const { startDate, endDate } = getPeriodRange();
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const params = useMemo(() => {
    const p = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });
    return p.toString();
  }, [startDate, endDate, currentPeriod.type]);

  const { data, error, isLoading } = useSWR(`/api/learning-journey-dashboard?${params}`, fetcher, {
    refreshInterval: 30000, // auto-refresh every 30 seconds
  });

  const { seriesData, categories, totalVisitors, averagePerVisit } = useMemo(() => {
    const timeline: TimelineEntry[] = data?.timeline || [];

    if (timeline.length === 0) {
      return { seriesData: [], categories: [], totalVisitors: 0, averagePerVisit: 0 };
    }

    const sorted = timeline.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels: string[] = [];
    const values: number[] = [];
    let total = 0;

    sorted.forEach(entry => {
      labels.push(entry.date);
      values.push(entry.total);
      total += entry.total;
    });

    return {
      seriesData: values,
      categories: labels,
      totalVisitors: total,
      averagePerVisit: values.length > 0 ? Math.round(total / values.length) : 0
    };
  }, [data]);

  const getChartTitle = () => `Visitors Timeline - ${getPeriodLabel()}`;

  const getChartSubtitle = () => {
    if (categories.length === 0) return "No visits recorded for this period";

    const visitCount = categories.length;
    switch (currentPeriod.type) {
      case 'quarterly':
        return `${visitCount} visits recorded in ${getPeriodLabel()}`;
      case 'financial':
        return `${visitCount} visits across financial year`;
      default:
        return `${visitCount} individual visits by date`;
    }
  };

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: chartType,
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
    },
    stroke: { curve: "straight", width: chartType === "bar" ? 0 : 2 },
    fill: {
      type: chartType === "area" ? "gradient" : "solid",
      gradient: { opacityFrom: 0.55, opacityTo: 0 }
    },
    markers: { size: chartType === "area" ? 0 : 4, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } }, padding: { right: 10, left: 10 } },
    dataLabels: { enabled: false },
    tooltip: { x: { format: "dd MMM yyyy" }, y: { formatter: (val: number) => `${val} visitors` } },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: { rotate: categories.length > 10 ? -55 : 0, maxHeight: 150, style: { fontSize: "12px" } },
    },
    yaxis: { labels: { style: { fontSize: "12px", colors: ["#6B7280"] }, formatter: (val: number) => Math.round(val).toString() } },
    noData: { text: "No visits recorded for this period", align: "center", verticalAlign: "middle", style: { color: "#6B7280", fontSize: "16px" } },
  };

  const series = [{ name: "Visitors", data: seriesData }];

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
          {seriesData.length > 0 ? (
            <ReactApexChart options={options} series={series} type={chartType} height={310} />
          ) : (
            <div className="h-[310px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">📅</div>
                <p className="text-gray-500 dark:text-gray-400">No visits recorded for {getPeriodLabel().toLowerCase()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {seriesData.length > 0 && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">Total Visits</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{categories.length}</p>
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
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">{seriesData.length > 0 ? Math.max(...seriesData) : 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
