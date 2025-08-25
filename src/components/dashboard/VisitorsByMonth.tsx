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
  const { getPeriodRange, currentPeriod, getPeriodLabel } = usePeriod();
  const { startDate, endDate } = getPeriodRange();

  const params = useMemo(() => {
    const p = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });
    return p.toString();
  }, [startDate, endDate, currentPeriod.type]);

  const { data, error, isLoading } = useSWR(`/api/learning-journey-dashboard?${params}`, fetcher, {
    refreshInterval: 30000, // auto-refresh every 30s
  });

  const { periodData, labels } = useMemo(() => {
    if (!data?.periodBreakdown) return { periodData: [], labels: MONTHS };

    const breakdown = data.periodBreakdown;

    if (currentPeriod.type === "quarterly") {
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

      return { periodData: quarterData, labels: quarterLabels };
    }

    if (currentPeriod.type === "financial") {
      const yearlyData = Array(12).fill(0);
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

      return { periodData: yearlyData, labels: finLabels };
    }

    // Default calendar year
    const yearlyData = Array(12).fill(0);
    breakdown.forEach((item: any) => {
      if (item.monthName && typeof item.total === "number") {
        const monthIndex = MONTHS.indexOf(item.monthName);
        if (monthIndex !== -1) yearlyData[monthIndex] = item.total;
      }
    });

    return { periodData: yearlyData, labels: MONTHS };
  }, [data, currentPeriod.type]);

  const getChartTitle = () => {
    switch (currentPeriod.type) {
      case "quarterly":
        return `Visitors by Month (${getPeriodLabel()})`;
      case "financial":
        return `Visitors by Month (Financial Year ${currentPeriod.year}-${currentPeriod.year + 1})`;
      default:
        return `Visitors by Month (${currentPeriod.year})`;
    }
  };

  const options: ApexOptions = {
    colors: ["#465fff"],
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
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: { text: undefined },
      labels: { formatter: (val: number) => Math.round(val).toString() },
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: { x: { show: false }, y: { formatter: (val: number) => `${val} visitors` } },
    noData: {
      text: "No data available for this period",
      align: "center",
      verticalAlign: "middle",
      style: { color: "#6B7280", fontSize: "14px" },
    },
  };

  const series = [{ name: "Visitors", data: periodData }];

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
            {getPeriodLabel()}
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
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Total Period Visitors:{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {periodData.reduce((sum, val) => sum + val, 0)}
            </span>
          </span>
          <span>
            Peak Month:{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {periodData.length > 0 && Math.max(...periodData) > 0
                ? labels[periodData.indexOf(Math.max(...periodData))] || "N/A"
                : "N/A"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
