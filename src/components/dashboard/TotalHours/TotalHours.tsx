"use client";

import React from "react";
import { useTotalHoursMetrics } from "@/hooks/learningJourney/DashboardComponents/useTotalHoursMetrics";

export default function TotalHours() {
  const { data, isLoading, error } = useTotalHoursMetrics();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Total Learning Hours
      </p>

      <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
        {data.hours}h {data.minutes}m
      </h2>

      <p className="text-xs text-gray-400 mt-2">
        Based on {data.totalMinutes} minutes
      </p>
    </div>
  );
}