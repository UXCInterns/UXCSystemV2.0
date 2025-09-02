"use client";

import React, { useState } from "react";
import { TrendingUp, GraduationCap, BriefcaseIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { usePeriod } from "@/context/PeriodContext";
import useSWR from "swr";
import Badge from "../ui/badge/Badge";

// SWR fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

export const ConversionsOverview = () => {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    getPeriodLabel 
  } = usePeriod();
  const [flipped, setFlipped] = useState(false);

  const { startDate, endDate } = getPeriodRange();
  const comparisonRange = getPeriodRange(comparisonPeriod);
  
  const params = new URLSearchParams({
    startDate,
    endDate,
    periodType: currentPeriod.type,
  });

  // Add comparison parameters if comparison mode is enabled
  if (isComparisonMode && comparisonPeriod) {
    params.append('isComparison', 'true');
    params.append('comparisonStartDate', comparisonRange.startDate);
    params.append('comparisonEndDate', comparisonRange.endDate);
  }

  const { data, error, isLoading } = useSWR(`/api/learning-journey-dashboard?${params}`, fetcher, {
    refreshInterval: 30000, // auto-refresh every 30s
  });

  if (isLoading) {
    return (
      <div className="relative w-full [perspective:1000px] animate-pulse">
        <div className="inset-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] w-full mx-auto">
          <div className="w-40 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="mb-6 flex flex-col gap-2 p-4 bg-gray-100 dark:bg-white/3 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="flex flex-col gap-2">
                <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-4 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="flex flex-col w-24 gap-2">
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

  const trainingCompanies = data?.training || [];
  const consultancyCompanies = data?.consultancy || [];
  const totalCompanies = data?.totalCompanies || 0;
  const uniqueCompanies = data?.uniqueCompanies || [];

  const trainingCount = trainingCompanies.length;
  const consultancyCount = consultancyCompanies.length;
  const totalConversions = trainingCount + consultancyCount;

  // Comparison data
  const comparisonTrainingCount = data?.comparison?.training?.length || 0;
  const comparisonConsultancyCount = data?.comparison?.consultancy?.length || 0;
  const comparisonTotalCompanies = data?.comparison?.totalCompanies || 0;
  const comparisonUniqueCompanies = data?.comparison?.uniqueCompanies || [];
  const comparisonTotalConversions = comparisonTrainingCount + comparisonConsultancyCount;

  // Calculate total conversion percentage (conversions over both periods / companies over both periods)
  let totalPercentage = "0";
  if (isComparisonMode) {
    const totalConversionsAllPeriods = totalConversions + comparisonTotalConversions;
    const totalCompaniesAllPeriods = totalCompanies + comparisonTotalCompanies;
    totalPercentage = totalCompaniesAllPeriods > 0 
      ? ((totalConversionsAllPeriods / totalCompaniesAllPeriods) * 100).toFixed(1)
      : "0";
  } else {
    totalPercentage = totalCompanies > 0 
      ? ((totalConversions / totalCompanies) * 100).toFixed(1)
      : "0";
  }

  // Calculate changes
  const trainingChange = isComparisonMode && comparisonTrainingCount > 0
    ? (((trainingCount - comparisonTrainingCount) / comparisonTrainingCount) * 100).toFixed(1)
    : null;
  
  const consultancyChange = isComparisonMode && comparisonConsultancyCount > 0
    ? (((consultancyCount - comparisonConsultancyCount) / comparisonConsultancyCount) * 100).toFixed(1)
    : null;

  const totalConversionsChange = isComparisonMode && comparisonTotalConversions > 0
    ? (((totalConversions - comparisonTotalConversions) / comparisonTotalConversions) * 100).toFixed(1)
    : null;

  const renderChangeIndicator = (change: string | null) => {
    if (!change || change === '0.0') return null;
    
    const isPositive = parseFloat(change) > 0;
    return (
      <div className={`flex items-center gap-1 text-xs font-medium ml-2 ${
        isPositive 
          ? 'text-green-600 dark:text-green-400' 
          : 'text-red-600 dark:text-red-400'
      }`}>
        {isPositive ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
        {Math.abs(parseFloat(change))}%
      </div>
    );
  };

  // Render stacked progress bar for comparison mode
  const renderStackedProgressBar = (primaryValue: number, comparisonValue: number, totalMax: number, primaryColor: string, comparisonColor: string) => {
    if (!isComparisonMode) {
      const percentage = totalMax > 0 ? ((primaryValue / totalMax) * 100) : 0;
      return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: primaryColor,
            }}
          />
        </div>
      );
    }

    const total = primaryValue + comparisonValue;
    const primaryPercentage = total > 0 ? ((primaryValue / total) * 100) : 0;
    const comparisonPercentage = total > 0 ? ((comparisonValue / total) * 100) : 0;
    const totalBarWidth = totalMax > 0 ? ((total / totalMax) * 100) : 0;

    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
        <div 
          className="h-3 rounded-full flex transition-all duration-500"
          style={{ width: `${totalBarWidth}%` }}
        >
          {/* Primary period segment */}
          <div
            className="h-3 transition-all duration-500"
            style={{
              width: `${primaryPercentage}%`,
              backgroundColor: primaryColor,
              borderTopLeftRadius: '9999px',
              borderBottomLeftRadius: '9999px',
              borderTopRightRadius: comparisonPercentage > 0 ? '0' : '9999px',
              borderBottomRightRadius: comparisonPercentage > 0 ? '0' : '9999px',
            }}
          />
          {/* Comparison period segment */}
          {comparisonPercentage > 0 && (
            <div
              className="h-3 transition-all duration-500"
              style={{
                width: `${comparisonPercentage}%`,
                backgroundColor: comparisonColor,
                borderTopRightRadius: '9999px',
                borderBottomRightRadius: '9999px',
              }}
            />
          )}
        </div>
      </div>
    );
  };

  // Render total conversions stacked bar
  const renderTotalConversionsBar = () => {
    if (!isComparisonMode) {
      const percentage = parseFloat(totalPercentage);
      return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
          <div
            className="h-4 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: "#22c55e",
            }}
          />
        </div>
      );
    }

    const totalCompaniesAllPeriods = totalCompanies + comparisonTotalCompanies;
    const combinedConversions = totalConversions + comparisonTotalConversions;
    const primaryPercentage = combinedConversions > 0 ? ((totalConversions / combinedConversions) * 100) : 0;
    const comparisonPercentage = combinedConversions > 0 ? ((comparisonTotalConversions / combinedConversions) * 100) : 0;
    const totalBarWidth = totalCompaniesAllPeriods > 0 ? ((combinedConversions / totalCompaniesAllPeriods) * 100) : 0;

    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
        <div 
          className="h-4 rounded-full flex transition-all duration-500"
          style={{ width: `${totalBarWidth}%` }}
        >
          {/* Primary period conversions */}
          <div
            className="h-4 transition-all duration-500"
            style={{
              width: `${primaryPercentage}%`,
              backgroundColor: "#22c55e",
              borderTopLeftRadius: '9999px',
              borderBottomLeftRadius: '9999px',
              borderTopRightRadius: comparisonPercentage > 0 ? '0' : '9999px',
              borderBottomRightRadius: comparisonPercentage > 0 ? '0' : '9999px',
            }}
          />
          {/* Comparison period conversions */}
          {comparisonPercentage > 0 && (
            <div
              className="h-4 transition-all duration-500"
              style={{
                width: `${comparisonPercentage}%`,
                backgroundColor: "#15803d",
                borderTopRightRadius: '9999px',
                borderBottomRightRadius: '9999px',
              }}
            />
          )}
        </div>
      </div>
    );
  };

  const dataBars = [
    {
      name: "Training",
      value: trainingCount,
      comparisonValue: comparisonTrainingCount,
      color: "#465FFF",
      comparisonColor: "#3730a3",
      icon: <GraduationCap className="text-gray-700 w-6 h-6 dark:text-white/90" />,
      change: trainingChange,
    },
    {
      name: "Consultancy",
      value: consultancyCount,
      comparisonValue: comparisonConsultancyCount,
      color: "#10b981",
      comparisonColor: "#047857",
      icon: <BriefcaseIcon className="text-gray-700 w-6 h-6 dark:text-white/90" />,
      change: consultancyChange,
    },
  ];

  const maxConversions = Math.max(
    totalConversions,
    isComparisonMode ? comparisonTotalConversions : 0,
    Math.max(...dataBars.map(item => Math.max(item.value, item.comparisonValue)))
  );

  return (
    <div
      className="relative w-full cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className={`w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="inset-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] w-full mx-auto [backface-visibility:hidden]">
          <div className="flex flex-col mb-3">
            <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-100">
              Conversions Overview
            </h4>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {getPeriodLabel()}
              {isComparisonMode && comparisonPeriod && (
                <span className="ml-2 text-blue-500">
                  vs {getPeriodLabel(comparisonPeriod)}
                </span>
              )}
            </p>
          </div>

          <div className="mb-4 flex flex-col gap-2 p-4 bg-gray-100 dark:bg-white/3 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-900">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                  Total Conversions
                  {isComparisonMode && (
                    <span className="ml-1 text-xs">
                      (Combined Rate)
                    </span>
                  )}
                </span>
                <div className="flex items-center">
                  <span className="text-3xl font-extrabold text-gray-800 dark:text-white">
                    {isComparisonMode ? totalConversions + comparisonTotalConversions : totalConversions}
                  </span>
                  
                  {renderChangeIndicator(totalConversionsChange)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {renderTotalConversionsBar()}
              <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                {totalPercentage}%
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {dataBars.map((item) => {
              const primaryPercentage = isComparisonMode && maxConversions > 0 
                ? ((item.value / maxConversions) * 100).toFixed(1)
                : totalConversions > 0 
                  ? ((item.value / totalConversions) * 100).toFixed(1) 
                  : "0";

              return (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    {item.icon}
                  </div>
                  <div className="flex flex-col w-24">
                    <span className="text-md font-medium text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                        {item.value}
                        {isComparisonMode && (
                          <span className="text-xs ml-1">
                            (vs {item.comparisonValue})
                          </span>
                        )}
                      </span>
                      {renderChangeIndicator(item.change)}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {renderStackedProgressBar(
                        item.value, 
                        item.comparisonValue, 
                        maxConversions,
                        item.color,
                        item.comparisonColor
                      )}
                      <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                        {primaryPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto custom-scrollbar">
          <h4 className="text-lg font-semibold mb-4">
            Companies - {getPeriodLabel()}
            {isComparisonMode && comparisonPeriod && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                vs {getPeriodLabel(comparisonPeriod)}
              </span>
            )}
          </h4>
          
          <div className="flex gap-6">
            {/* Training Column */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h5 className="font-medium text-blue-600 dark:text-blue-400">
                  Training ({trainingCount})
                </h5>
                {isComparisonMode && (
                  <span className="text-xs text-gray-500">
                    (was {comparisonTrainingCount})
                  </span>
                )}
              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                {trainingCompanies.length ? (
                  trainingCompanies.map((name: string, i: number) => (
                    <li key={i} className="border-b border-gray-100 dark:border-gray-800 pb-1">
                      {name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No training companies in this period</li>
                )}
              </ul>
            </div>

            {/* Consultancy Column */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h5 className="font-medium text-green-600 dark:text-green-400">
                  Consultancy ({consultancyCount})
                  {isComparisonMode && (
                  <span className="text-xs text-gray-500 ml-2">
                    (was {comparisonConsultancyCount})
                  </span>
                )}
                </h5>

              </div>
              <ul className="space-y-2 text-sm text-gray-400">
                {consultancyCompanies.length ? (
                  consultancyCompanies.map((name: string, i: number) => (
                    <li key={i} className="border-b border-gray-100 dark:border-gray-800 pb-1">
                      {name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No consultancy companies in this period</li>
                )}
              </ul>
            </div>
          </div>

          {/* Comparison Summary (if in comparison mode) */}
          {isComparisonMode && data?.comparison && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Period Comparison Summary
              </h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">Primary Period:</p>
                  <p className="font-medium">Training: {trainingCount}</p>
                  <p className="font-medium">Consultancy: {consultancyCount}</p>
                  <p className="font-semibold">Total: {totalConversions}</p>
                  <p className="font-medium">Companies: {totalCompanies}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 dark:text-gray-400">Comparison Period:</p>
                  <p className="font-medium">Training: {comparisonTrainingCount}</p>
                  <p className="font-medium">Consultancy: {comparisonConsultancyCount}</p>
                  <p className="font-semibold">Total: {comparisonTotalConversions}</p>
                  <p className="font-medium">Companies: {comparisonTotalCompanies}</p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Combined Conversion Rate: {totalPercentage}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ({totalConversions + comparisonTotalConversions} conversions / {totalCompanies + comparisonTotalCompanies} total companies)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};