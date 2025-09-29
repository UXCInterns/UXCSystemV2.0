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

interface TotalTraineeHoursProps {
  programType?: "pace" | "non_pace";
}

export default function TotalTraineeHours({ programType }: TotalTraineeHoursProps) {
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

  // Add program type filter if provided
  if (programType) {
    params.set('programType', programType);
  }

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
  const { data, error, isLoading } = useSWR(`/api/workshops-dashboard?${params}`, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: false
  });

  // Extract trainee hours from metrics
  const primaryHours = data?.metrics?.primary?.totalTraineeHours || 0;
  const comparisonHours = data?.metrics?.comparison?.totalTraineeHours || 0;
  
  // Set max value based on program type
  const maxValue = programType === "pace" ? 5000 : 35000;
    
  // Calculate percentage change
  const percentageChange = comparisonHours > 0 
    ? (((primaryHours - comparisonHours) / comparisonHours) * 100).toFixed(1)
    : primaryHours > 0 ? "100" : "0";

  const difference = primaryHours - comparisonHours;

  // Chart series - multiple bars in one chart
  const series = isComparisonMode 
    ? [(primaryHours / maxValue) * 100, (comparisonHours / maxValue) * 100]
    : [(primaryHours / maxValue) * 100];

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
            fontSize: isComparisonMode ? "40px" : "40px",
            fontWeight: "600",
            offsetY: isComparisonMode ? -40 : -40,
            color: "#1D2939",
            formatter: function(val: number) {
              return isLoading ? "..." : `${Math.round((val / 100) * maxValue).toLocaleString()}`;
            },
          },
          total: {
            show: isComparisonMode,
            label: 'Total Trainee Hours',
            fontSize: '16px',
            fontWeight: '600',
            color: '#64748B',
            formatter: function () {
              return isLoading ? "..." : `${(primaryHours + comparisonHours).toLocaleString()}`;
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
      : ["Trainee Hours"],
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
              Total Trainee Hours
            </h3>
            <p className="font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              {isComparisonMode 
                ? `${getPeriodLabel()} vs ${getPeriodLabel(comparisonPeriod)}`
                : `Total trainee hours - ${getPeriodLabel()}`
              }
              {programType && (
                <span className="ml-1 text-blue-600 dark:text-blue-400">
                  ({programType === "pace" ? "PACE" : "NON-PACE"})
                </span>
              )}
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

          {/* Badge for non-comparison mode - shows progress status */}
          {!isComparisonMode && (
            <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] mt-6">
              <Badge
                variant="light"
                color="primary"
                size="sm"
              >
                {primaryHours >= maxValue * 0.7 
                  ? "Excellent Progress" 
                  : primaryHours >= maxValue * 0.5
                  ? "Good Progress"
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
                ? `${difference.toLocaleString()} more hours than the ${getPeriodComparisonLabel()}. Great job!`
                : `${Math.abs(difference).toLocaleString()} fewer hours than the ${getPeriodComparisonLabel()}. Keep pushing!`}
            </>
          ) : (
            <>
              We have{" "}
              {primaryHours.toLocaleString()} trainee hours during {getPeriodLabel().toLowerCase()}
              {programType && ` for ${programType === "pace" ? "PACE" : "NON-PACE"} programs`}.
              {primaryHours >= maxValue * 0.7 
                ? " Excellent training progress!" 
                : primaryHours >= maxValue * 0.5
                ? " Good training volume!"
                : " Room for improvement."}
            </>
          )}
        </p>
      </div>
    </div>
  );
}