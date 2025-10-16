"use client";
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import useSWR from 'swr';
import { usePeriod } from '@/context/PeriodContext';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BIALevelMetricsProps {
  programType?: "pace" | "non_pace";
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const BIALevelMetrics: React.FC<BIALevelMetricsProps> = ({ programType }) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    getPeriodLabel 
  } = usePeriod();

  const { startDate, endDate } = getPeriodRange();
  const comparisonRange = comparisonPeriod ? getPeriodRange(comparisonPeriod) : null;

  const params = useMemo(() => {
    const p = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });

    if (programType) {
      p.set('programType', programType);
    }

    if (isComparisonMode && comparisonPeriod && comparisonRange) {
      p.append('isComparison', 'true');
      p.append('comparisonStartDate', comparisonRange.startDate);
      p.append('comparisonEndDate', comparisonRange.endDate);
    }

    return p.toString();
  }, [startDate, endDate, currentPeriod.type, programType, isComparisonMode, comparisonPeriod, comparisonRange]);

  const { data, error, isLoading } = useSWR(`/api/workshops-dashboard?${params}`, fetcher, {
    refreshInterval: 30000,
  });

  const biaLevels = data?.biaLevels || [];
  const comparisonBiaLevels = data?.comparisonBIALevels || [];
  
  const totalWorkshops = useMemo(() => 
    biaLevels.reduce((sum: number, level: any) => sum + level.count, 0),
    [biaLevels]
  );

  const totalComparisonWorkshops = useMemo(() => 
    comparisonBiaLevels.reduce((sum: number, level: any) => sum + level.count, 0),
    [comparisonBiaLevels]
  );

  // Color mapping for BIA levels
  const colorMap: { [key: string]: string } = {
    'Basic': '#3b82f6',
    'Intermediate': '#2563eb',
    'Advanced': '#1e40af',
    'Uncategorized': '#93c5fd'
  };

  const comparisonColorMap: { [key: string]: string } = {
    'Basic': '#fca5a5',
    'Intermediate': '#f87171',
    'Advanced': '#ef4444',
    'Uncategorized': '#fecaca'
  };

  // Prepare chart data for comparison mode
  const chartLabels = useMemo(() => {
    if (isComparisonMode) {
      return biaLevels.flatMap((level: any) => [
        `${level.level}`,
        `${level.level}`
      ]);
    }
    return biaLevels.map((level: any) => level.level);
  }, [biaLevels, isComparisonMode]);

  const chartColors = useMemo(() => {
    if (isComparisonMode) {
      return biaLevels.flatMap((level: any) => [
        colorMap[level.level] || '#93c5fd',
        comparisonColorMap[level.level] || '#fecaca'
      ]);
    }
    return biaLevels.map((level: any) => colorMap[level.level] || '#93c5fd');
  }, [biaLevels, isComparisonMode]);

  const chartSeries = useMemo(() => {
    if (isComparisonMode) {
      return biaLevels.flatMap((level: any) => {
        const compLevel = comparisonBiaLevels.find((cl: any) => cl.level === level.level);
        return [level.count, compLevel?.count || 0];
      });
    }
    return biaLevels.map((level: any) => level.count);
  }, [biaLevels, comparisonBiaLevels, isComparisonMode]);

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      events: {
        dataPointMouseEnter: function (event, chartContext, config) {
          setHoveredValue(chartSeries[config.dataPointIndex]);
          setHoveredLabel(chartLabels[config.dataPointIndex]);
        },
        dataPointMouseLeave: function () {
          setHoveredValue(null);
          setHoveredLabel(null);
        }
      }
    },
    labels: chartLabels,
    colors: chartColors,
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontFamily: "Outfit",
              fontWeight: 600,
              color: "#6b7280",
              formatter: function () {
                if (hoveredLabel) {
                  return hoveredLabel; // show slice label on hover
                }
                return "Total"; // default label
              }
            },
            value: {
              show: true,
              fontSize: "28px",
              fontFamily: "Outfit",
              fontWeight: 700,
              color: "#111827",
              offsetY: 5,
            },
            total: {
              show: true, // we override with name + value instead
              fontSize: "15px",
              fontFamily: "Outfit",
              fontWeight: 600,
            }
          }
        }
      }
    },
    tooltip: {
      enabled: false,
      y: {
        formatter: function (val) {
          return val + " workshops";
        }
      }
    },
    states: {
      hover: {
        filter: { type: "lighten" } // Removed the `value` property
      },
      active: {
        filter: { type: "none" }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-5"></div>
        <div className="flex flex-col items-center gap-8 xl:flex-row">
          <div className="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="flex flex-col gap-4 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-5 sm:p-6">
        <p className="text-red-600 dark:text-red-400">Failed to load BIA levels: {error.message}</p>
      </div>
    );
  }

  const hasData = biaLevels.length > 0 && totalWorkshops > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            BIA Level Distribution
          </h3>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Chart + Details */}
          <div className="flex flex-col items-center gap-6 xl:flex-row">
            <div className="w-50 relative">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height={210}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 xl:flex xl:flex-col gap-4 w-full xl:w-auto max-h-[220px] xl:overflow-y-auto custom-scrollbar">
              {biaLevels.map((level: any, index: number) => {
                const percentage = totalWorkshops > 0 
                  ? Math.round((level.count / totalWorkshops) * 100) 
                  : 0;
                
                const comparisonLevel = comparisonBiaLevels.find(
                  (cl: any) => cl.level === level.level
                );
                const comparisonCount = comparisonLevel?.count || 0;
                const comparisonPercentage = totalComparisonWorkshops > 0
                  ? Math.round((comparisonCount / totalComparisonWorkshops) * 100)
                  : 0;
                
                return (
                  <div key={index} className="flex items-start gap-2.5 mr-2 mb-3">
                    <div className="flex gap-1 mt-1.5">
                      <div 
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: colorMap[level.level] || '#93c5fd' }}
                      ></div>
                      {isComparisonMode && (
                        <div 
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: comparisonColorMap[level.level] || '#fecaca' }}
                        ></div>
                      )}
                    </div>
                    <div>
                      <h5 className="mb-1 font-medium text-gray-800 text-sm dark:text-white/90">
                        {level.level}
                      </h5>
                      <div className="flex flex-col gap-0.5 text-sm">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-blue-600 dark:text-blue-400">
                            {percentage}%
                          </p>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <p className="text-gray-500 dark:text-gray-400">
                            {level.count} Workshop{level.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {isComparisonMode && (
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-red-500 dark:text-red-400">
                              {comparisonPercentage}%
                            </p>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <p className="text-gray-500 dark:text-gray-400">
                              {comparisonCount} Workshop{comparisonCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-23">
          <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">📊</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No BIA level data available for this period
            {programType && ` - ${programType === "pace" ? "PACE" : "NON-PACE"}`}
          </p>
        </div>
      )}
    </div>
  );
};