"use client";

import React from "react";
import { useTotalHoursMetrics } from "@/hooks/learningJourney/DashboardComponents/useTotalHoursMetrics";

export default function TotalHours() {
  const { data, isLoading, error } = useTotalHoursMetrics();

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">Total Learning Hours</p>

      <h2 className="text-3xl font-bold mt-2">
        {data.hours}h {data.minutes}m
      </h2>

      <p className="text-xs text-gray-400 mt-2">
        Based on {data.totalMinutes} minutes
      </p>
    </div>
  );
}