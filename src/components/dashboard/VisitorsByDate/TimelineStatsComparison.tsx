import React from "react";

interface TimelineStatsComparisonProps {
  primaryVisits: number;
  comparisonVisits: number;
  totalVisitors: number;
  comparisonTotalVisitors: number;
  averagePerVisit: number;
  comparisonAveragePerVisit: number;
  peakVisit: number;
  comparisonPeakVisit: number;
  hasComparisonData: boolean;
}

export const TimelineStatsComparison = ({
  primaryVisits,
  comparisonVisits,
  totalVisitors,
  comparisonTotalVisitors,
  averagePerVisit,
  comparisonAveragePerVisit,
  peakVisit,
  comparisonPeakVisit,
  hasComparisonData,
}: TimelineStatsComparisonProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400">Primary Visits</p>
        <div className="flex items-baseline justify-center gap-2">
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            {primaryVisits}
          </p>
          {hasComparisonData && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              vs {comparisonVisits}
            </p>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400">Primary Visitors</p>
        <div className="flex items-baseline justify-center gap-2">
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {totalVisitors}
          </p>
          {hasComparisonData && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              vs {comparisonTotalVisitors}
            </p>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400">Primary Avg</p>
        <div className="flex items-baseline justify-center gap-2">
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {averagePerVisit}
          </p>
          {hasComparisonData && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              vs {comparisonAveragePerVisit}
            </p>
          )}
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400">Primary Peak</p>
        <div className="flex items-baseline justify-center gap-2">
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {peakVisit}
          </p>
          {hasComparisonData && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              vs {comparisonPeakVisit}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};