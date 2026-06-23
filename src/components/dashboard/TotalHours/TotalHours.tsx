"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { usePeriod } from "@/context/PeriodContext";
import { useTotalHoursMetrics } from "@/hooks/learningJourney/DashboardComponents/useTotalHoursMetrics";

// CHANGE THE TOTAL HOURS ACCORDINGLY 
const MAX_HOURS = 100;

export default function TotalHours() {
  const { theme } = useTheme();

  const {
    getPeriodLabel,
    comparisonPeriod,
    isComparisonMode,
  } = usePeriod();

  const { data, error, isLoading } = useTotalHoursMetrics();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
        <div className="h-44 w-44 mx-auto rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load data. Please try refreshing the page.
        </p>
      </div>
    );
  }

  const totalMinutes = data?.totalMinutes || 0;
  const totalHours = totalMinutes / 60;

  const displayHours = Math.floor(totalHours);
  const displayMinutes = totalMinutes % 60;

  /* COMPARISON CALCULATIONS */
  const comparisonMinutes = data?.comparisonTotalMinutes || 0;

  const differenceMinutes = totalMinutes - comparisonMinutes;

  const differenceHours = Math.floor(
    Math.abs(differenceMinutes) / 60
  );

  const differenceRemainingMinutes =
    Math.abs(differenceMinutes) % 60;

  const percentage = Math.min((totalHours / MAX_HOURS) * 100, 100);

  // Progress Circle
  const size = 180;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const trackColor = theme === "dark" ? "#1f2937" : "#e5e7eb";
  const progressColor = theme === "dark" ? "#60a5fa" : "#3b82f6";

  return (
    <div className="w-full h-full rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.00]">
      <div className="h-full flex flex-col px-5 pt-5 bg-white shadow-default rounded-2xl pb-5 border-b border-gray-200 dark:border-gray-800 rounded-2xl pb-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">

        {/* HEADER - Same style as VisitorsAttended */}
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Learning Journey
            </h3>

            <p className="font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              {isComparisonMode
                ? `${getPeriodLabel()} vs ${
                    comparisonPeriod
                      ? getPeriodLabel(comparisonPeriod)
                      : ""
                  }`
                : `Total Learning Journey Hours - ${getPeriodLabel()}`}
            </p>
          </div>
        </div>

        {/* PROGRESS CIRCLE */}
        <div className="relative flex justify-center items-center h-[230px]">
          <svg width={size} height={size} className="rotate-[-90deg]">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={trackColor}
              strokeWidth={stroke}
              fill="none"
            />

            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={progressColor}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.6s ease",
              }}
            />
          </svg>

          {/* CENTER TEXT */}
          {/* WHEN THE HOURS REACHES 1000 HOURS CHANGE THE "text-3xl" to "text-2xl" */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {displayHours}h {displayMinutes}m
            </h2>

            <p className="text-xl font-bold text-black-400 mt-1">
              {Math.round(percentage)}% of goal
            </p>
          </div>
        </div>

        {/* FOOTER */}
        {/* "-mt-2" for negative -8px for margin top due to too much space & need alignment */}
        <div className="mt-auto text-center">
          <p className="mx-auto -mt-2 w-full text-center text-sm text-gray-500 dark:text-gray-500 sm:text-base">
            {isComparisonMode ? (
              <>
                We have{" "}
                {differenceMinutes >= 0
                  ? `${differenceHours} hours and ${differenceRemainingMinutes} minutes more learning journey hours than the ${
                      comparisonPeriod
                        ? getPeriodLabel(comparisonPeriod)
                        : "previous period"
                    }. Good job!`
                  : `${differenceHours} hours and ${differenceRemainingMinutes} minutes less learning journey hours than the ${
                      comparisonPeriod
                        ? getPeriodLabel(comparisonPeriod)
                        : "previous period"
                    }. Keep fighting!`}
              </>
            ) : (
              <>
                We have accumulated {displayHours} hours and {displayMinutes} minutes of
                learning journey during {getPeriodLabel()}. Room for growth in learning
                journey hours.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}