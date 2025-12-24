import React from "react";

interface TimelineStatsSingleProps {
  totalVisits: number;
  totalVisitors: number;
  averagePerVisit: number;
  peakVisit: number;
}

export const TimelineStatsSingle = ({
  totalVisits,
  totalVisitors,
  averagePerVisit,
  peakVisit,
}: TimelineStatsSingleProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div className="text-center">
        <p className="text-gray-500 dark:text-gray-400">Total Visits</p>
        <p className="text-xl font-bold text-gray-800 dark:text-white">{totalVisits}</p>
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
  );
};