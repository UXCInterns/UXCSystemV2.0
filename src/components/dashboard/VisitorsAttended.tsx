"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";
import { useTheme } from "@/context/ThemeContext";
import Badge from "../ui/badge/Badge";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// SWR fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function VisitorsAttended() {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    getPeriodLabel 
  } = usePeriod();

  const { startDate, endDate } = getPeriodRange();
  
  // Build API parameters
  const params = new URLSearchParams({
    startDate,
    endDate,
    periodType: currentPeriod.type,
  });

  // Add comparison parameters if comparison mode is enabled
  if (isComparisonMode && comparisonPeriod) {
    params.set('isComparison', 'true');
    
    // Get comparison period date range
    const getComparisonDateRange = () => {
      if (comparisonPeriod.type === 'custom' && comparisonPeriod.startDate && comparisonPeriod.endDate) {
        return {
          startDate: comparisonPeriod.startDate,
          endDate: comparisonPeriod.endDate
        };
      }
      
      if (comparisonPeriod.type === 'quarterly') {
        const year = comparisonPeriod.year;
        const quarter = comparisonPeriod.quarter || 1;
        const startMonth = (quarter - 1) * 3;
        const endMonth = startMonth + 2;
        return {
          startDate: `${year}-${(startMonth + 1).toString().padStart(2, '0')}-01`,
          endDate: `${year}-${(endMonth + 1).toString().padStart(2, '0')}-${new Date(year, endMonth + 1, 0).getDate()}`
        };
      }
      
      if (comparisonPeriod.type === 'financial') {
        return {
          startDate: `${comparisonPeriod.year}-04-01`,
          endDate: `${comparisonPeriod.year + 1}-03-31`
        };
      }
      
      // Calendar year
      return {
        startDate: `${comparisonPeriod.year}-01-01`,
        endDate: `${comparisonPeriod.year}-12-31`
      };
    };

    const comparisonRange = getComparisonDateRange();
    params.set('comparisonStartDate', comparisonRange.startDate);
    params.set('comparisonEndDate', comparisonRange.endDate);
  }

  // SWR hook for fetching metrics
  const { data, error, isLoading } = useSWR(`/api/learning-journey-dashboard?${params}`, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false
  });

  const primaryVisitors = data?.totalVisitors || 0;
  const comparisonVisitors = data?.comparison?.totalVisitors || 0;
  const maxValue = 1000;
    
  // Calculate percentage change
  const percentageChange = comparisonVisitors > 0 
    ? (((primaryVisitors - comparisonVisitors) / comparisonVisitors) * 100).toFixed(1)
    : primaryVisitors > 0 ? "100" : "0";

  const difference = primaryVisitors - comparisonVisitors;

  // Chart series - multiple bars in one chart
  const series = isComparisonMode 
    ? [(primaryVisitors / maxValue) * 100, (comparisonVisitors / maxValue) * 100]
    : [(primaryVisitors / maxValue) * 100];

  // Chart options for multiple radial bars
  const { theme } = useTheme();
  const trackBackgroundColor = theme === "dark" ? "#1D2939" : "#f1f3f6ff";
  const options: ApexOptions = {
    colors: isComparisonMode ? ["#465FFF", "#FF6B6B"] : ["#465FFF"],
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
        hollow: { size: isComparisonMode ? "66%" : "77%" },
        track: { 
          background: trackBackgroundColor, 
          strokeWidth: "100%", 
          margin: isComparisonMode ? 5 : 5 
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: isComparisonMode ? 10 : 10,
            color: "#1D2939",
            fontSize: isComparisonMode ? "16px" : "16px",
            fontWeight: "600",
          },
          value: {
            show: true,
            fontSize: isComparisonMode ? "60px" : "60px",
            fontWeight: "600",
            offsetY: isComparisonMode ? -40 : -40,
            color: "#1D2939",
            formatter: function(val: number) {
              return isLoading ? "..." : `${Math.round((val / 100) * maxValue)}`;
            },
          },
          total: {
            show: isComparisonMode,
            label: 'Total Visitors Attended',
            fontSize: '16px',
            fontWeight: '600',
            color: '#64748B',
            formatter: function () {
              return isLoading ? "..." : `${primaryVisitors + comparisonVisitors}`;
            }
          }
        },
      },
    },
    fill: { 
      type: "solid", 
      colors: isComparisonMode ? ["#465FFF", "#FF6B6B"] : ["#465FFF"] 
    },
    stroke: { lineCap: "round" },
    labels: isComparisonMode 
      ? ["Primary Period", "Comparison Period"] 
      : ["Visitors Attended"],
  };

  const getPeriodComparisonLabel = () => {
    if (!isComparisonMode || !comparisonPeriod) {
      switch (currentPeriod.type) {
        case "calendar":
          return `previous calendar year`;
        case "financial":
          return `previous financial year`;
        case "quarterly":
          return `previous quarter`;
        case "custom":
          return `previous period`;
        default:
          return `previous period`;
      }
    }
    return getPeriodLabel(comparisonPeriod);
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
              {isComparisonMode 
                ? `${getPeriodLabel()} vs ${getPeriodLabel(comparisonPeriod)}`
                : `Total visitors attended - ${getPeriodLabel()}`
              }
            </p>
          </div>
        </div>

        {/* Single Chart Container */}
        <div className="relative">
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={330}
          />

          {/* Percentage badge positioned under total value in comparison mode */}
          {isComparisonMode && (
            <div className="absolute left-1/2 top-full -translate-x-1/2">
              <Badge
                variant="light"
                color={parseFloat(percentageChange) >= 0 ? "success" : "error"}
                size="sm"
              >
                {parseFloat(percentageChange) >= 0 ? `+${percentageChange}%` : `${percentageChange}%`}
              </Badge>
            </div>
          )}

          {/* Badge for non-comparison mode - shows completion status */}
          {!isComparisonMode && (
            <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] mt-6">
              <Badge
                variant="light"
                color="primary"
                size="sm"
              >
                {primaryVisitors >= maxValue * 0.7 
                  ? "Excellent Attendance" 
                  : primaryVisitors >= maxValue * 0.5
                  ? "Good Turnout"
                  : "Needs Improvement"}
              </Badge>
            </div>
          )}
        </div>

        {/* Summary Text */}
        <p className="mx-auto mt-8 w-full text-center text-sm text-gray-500 sm:text-base">
          {isComparisonMode ? (
            <>              
              We have{" "}
              {difference >= 0
                ? `${difference} more visitors than the ${getPeriodComparisonLabel()}. Good job!`
                : `${Math.abs(difference)} fewer visitors than the ${getPeriodComparisonLabel()}. Keep fighting!`}
            </>
          ) : (
            <>
              We have{" "}
              {primaryVisitors} visitors attended during {getPeriodLabel().toLowerCase()}.
              {primaryVisitors >= maxValue * 0.7 
                ? " Excellent attendance!" 
                : primaryVisitors >= maxValue * 0.5
                ? " Good turnout!"
                : " Room for growth in attendance."}
            </>
          )}
        </p>
      </div>
    </div>
  );
}