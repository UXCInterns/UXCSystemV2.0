"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { usePeriod } from "@/context/PeriodContext";
import useSWR from "swr";
import { useMemo, useState } from "react";
import ChartTypeToggle from "../common/ChartTypeToggle";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TraineeHoursByMonthProps {
  programType?: "pace" | "non_pace";
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TraineeHoursByMonth({ programType }: TraineeHoursByMonthProps) {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    getPeriodLabel 
  } = usePeriod();
  
  const { startDate, endDate } = getPeriodRange();
  const comparisonRange = comparisonPeriod ? getPeriodRange(comparisonPeriod) : null;
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const params = useMemo(() => {
    const p = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });

    // Add program type filter if provided
    if (programType) {
      p.set('programType', programType);
    }

    // Add comparison parameters if comparison mode is enabled
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

  const { 
    primarySeries, 
    comparisonSeries, 
    categories, 
    totalTraineeHours,
    comparisonTotalTraineeHours,
    averageMonthlyHours,
    comparisonAverageMonthlyHours,
    peakMonth,
    comparisonPeakMonth
  } = useMemo(() => {
    const workshops = data?.workshops || [];
    const comparisonWorkshops = data?.comparisonWorkshops || [];

    if (workshops.length === 0 && (!isComparisonMode || comparisonWorkshops.length === 0)) {
      return { 
        primarySeries: [], 
        comparisonSeries: [],
        categories: [], 
        totalTraineeHours: 0,
        comparisonTotalTraineeHours: 0,
        averageMonthlyHours: 0,
        comparisonAverageMonthlyHours: 0,
        peakMonth: '',
        comparisonPeakMonth: ''
      };
    }

    // Helper function to process workshops into monthly trainee hours
    const processMonthlyData = (workshopList: any[]) => {
      const monthlyData: { [key: string]: number } = {};
      
      workshopList.forEach(workshop => {
        const startDate = new Date(workshop.program_start_date);
        const monthKey = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        
        // Calculate trainee hours: participants × course hours
        const traineeHours = (workshop.no_of_participants || 0) * (workshop.course_hours || 0);
        monthlyData[monthKey] += traineeHours;
      });

      // Sort by date
      const sorted = Object.entries(monthlyData)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());

      return {
        months: sorted.map(([month]) => month),
        values: sorted.map(([, hours]) => hours),
        total: sorted.reduce((sum, [, hours]) => sum + hours, 0)
      };
    };

    const primary = processMonthlyData(workshops);
    const comparison = isComparisonMode ? processMonthlyData(comparisonWorkshops) : { months: [], values: [], total: 0 };

    let finalCategories: string[] = [];
    let primaryValues: number[] = [];
    let comparisonValues: number[] = [];

    if (!isComparisonMode) {
      finalCategories = primary.months;
      primaryValues = primary.values;
      
      // If there's only 1 month, add padding months to create a curve
      if (finalCategories.length === 1) {
        const singleMonth = new Date(finalCategories[0]);
        const prevMonth = new Date(singleMonth);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        const nextMonth = new Date(singleMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        finalCategories = [
          prevMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          finalCategories[0],
          nextMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        ];
        primaryValues = [0, primaryValues[0], 0];
      }
    } else {
      // Create unified timeline for comparison
      const allMonths = new Set([...primary.months, ...comparison.months]);
      finalCategories = Array.from(allMonths).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      // Map values to unified timeline
      primaryValues = finalCategories.map(month => {
        const index = primary.months.indexOf(month);
        return index >= 0 ? primary.values[index] : 0;
      });

      comparisonValues = finalCategories.map(month => {
        const index = comparison.months.indexOf(month);
        return index >= 0 ? comparison.values[index] : 0;
      });
      
      // If there's only 1 month total in comparison mode, add padding
      if (finalCategories.length === 1) {
        const singleMonth = new Date(finalCategories[0]);
        const prevMonth = new Date(singleMonth);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        const nextMonth = new Date(singleMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        finalCategories = [
          prevMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          finalCategories[0],
          nextMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        ];
        primaryValues = [0, primaryValues[0], 0];
        comparisonValues = [0, comparisonValues[0], 0];
      }
    }

    // Calculate statistics
    const primaryNonZeroValues = primaryValues.filter(v => v > 0);
    const comparisonNonZeroValues = comparisonValues.filter(v => v > 0);

    const primaryPeakIndex = primaryValues.indexOf(Math.max(...primaryValues));
    const comparisonPeakIndex = comparisonValues.indexOf(Math.max(...comparisonValues));

    return {
      primarySeries: primaryValues,
      comparisonSeries: comparisonValues,
      categories: finalCategories,
      totalTraineeHours: primary.total,
      comparisonTotalTraineeHours: comparison.total,
      averageMonthlyHours: primaryNonZeroValues.length > 0 
        ? Math.round(primary.total / primaryNonZeroValues.length) 
        : 0,
      comparisonAverageMonthlyHours: comparisonNonZeroValues.length > 0 
        ? Math.round(comparison.total / comparisonNonZeroValues.length) 
        : 0,
      peakMonth: finalCategories[primaryPeakIndex] || '',
      comparisonPeakMonth: finalCategories[comparisonPeakIndex] || ''
    };
  }, [data, isComparisonMode]);

  const getChartTitle = () => {
    if (isComparisonMode && comparisonPeriod) {
      return `Trainee Hours Comparison by Month`;
    }
    return `Trainee Hours by Month`;
  };

  const getChartSubtitle = () => {
    if (categories.length === 0) return "No training data for this period";

    if (isComparisonMode && comparisonPeriod) {
      return `${getPeriodLabel()} vs ${getPeriodLabel(comparisonPeriod)}${programType ? ` - ${programType === "pace" ? "PACE" : "NON-PACE"}` : ''}`;
    }

    return `Monthly breakdown - ${getPeriodLabel()}${programType ? ` - ${programType === "pace" ? "PACE" : "NON-PACE"}` : ''}`;
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
      ? ["#465FFF", "#FF6B6B"]
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
      size: chartType === "area" ? 4 : 4, 
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
      enabled: true,
      y: {
        formatter: (val: number) => `${val.toLocaleString()} hours`
      }
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: { 
        rotate: categories.length > 10 ? -45 : 0, 
        style: { fontSize: "11px" }
      },
    },
    yaxis: { 
      labels: { 
        style: { fontSize: "12px", colors: ["#6B7280"] }, 
        formatter: (val: number) => Math.round(val).toLocaleString()
      } 
    },
    noData: { 
      text: "No training data for this period", 
      align: "center", 
      verticalAlign: "middle", 
      style: { color: "#6B7280", fontSize: "16px" } 
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 4,
      }
    }
  };

  const series = useMemo(() => {
    const result = [{ 
      name: isComparisonMode ? getPeriodLabel() : "Trainee Hours", 
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
            <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
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

  const hasData = primarySeries.length > 0 && primarySeries.some(v => v > 0);
  const hasComparisonData = isComparisonMode && comparisonSeries.length > 0 && comparisonSeries.some(v => v > 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {getChartTitle()}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {getChartSubtitle()}
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <ChartTypeToggle selectedType={chartType} onChange={setChartType} />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar lg:overflow-x-hidden">
        <div className="min-w-[1000px] xl:min-w-full">
          {hasData ? (
            <ReactApexChart 
              options={options} 
              series={series} 
              type={chartType} 
              height={310} 
            />
          ) : (
            <div className="h-[310px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">📊</div>
                <p className="text-gray-500 dark:text-gray-400">
                  No training data for {getPeriodLabel().toLowerCase()}
                  {programType && ` - ${programType === "pace" ? "PACE" : "NON-PACE"}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasData && (
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          {isComparisonMode ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Primary Months</p>
                <div className="flex items-baseline justify-center gap-2">
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {primarySeries.filter(v => v > 0).length}
                  </p>
                  {hasComparisonData && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      vs {comparisonSeries.filter(v => v > 0).length}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Primary Total Hours</p>
                <div className="flex items-baseline justify-center gap-2">
                  <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {totalTraineeHours.toLocaleString()}
                  </p>
                  {hasComparisonData && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      vs {comparisonTotalTraineeHours.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Primary Avg/Month</p>
                <div className="flex items-baseline justify-center gap-2">
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {averageMonthlyHours.toLocaleString()}
                  </p>
                  {hasComparisonData && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      vs {comparisonAverageMonthlyHours.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Primary Peak</p>
                <div className="flex items-baseline justify-center gap-2">
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.max(...primarySeries).toLocaleString()}
                  </p>
                  {hasComparisonData && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      vs {Math.max(...comparisonSeries).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Active Months</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {primarySeries.filter(v => v > 0).length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Total Hours</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {totalTraineeHours.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Avg per Month</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {averageMonthlyHours.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Peak Month</p>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.max(...primarySeries).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}