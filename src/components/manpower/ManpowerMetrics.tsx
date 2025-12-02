"use client";

import React, { useState, useEffect } from "react";
import { onProjectUpdate } from "@/lib/projectEvents";

type ManpowerAllocation = {
  profile_id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  projects_as_manager: number;
  projects_as_lead: number;
  projects_as_core_team: number;
  projects_as_support_team: number;
  total_projects: number;
  tasks_assigned: number;
  active_projects_count: number;
};

type StatusType = "Available" | "Busy" | "Overloaded";

export const ManpowerMetrics = () => {
  const [manpower, setManpower] = useState<ManpowerAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Compute status based on core and support team involvement
  const computeStatus = (record: ManpowerAllocation): StatusType => {
    const coreCount = record.projects_as_core_team;
    const supportCount = record.projects_as_support_team;
    
    // Overloaded: 5+ core OR 5+ support
    if (coreCount >= 5 || supportCount >= 5) {
      return "Overloaded";
    }
    
    // Busy: More than 2 core OR more than 3 support
    if (coreCount > 2 || supportCount > 3) {
      return "Busy";
    }
    
    // Available: 2 or fewer core AND 3 or fewer support
    return "Available";
  };

  // Fetch manpower data from API
  const fetchManpower = async () => {
    try {
      const response = await fetch('/api/manpower');
      if (!response.ok) throw new Error('Failed to fetch manpower data');
      
      const data = await response.json();
      setManpower(data.manpower || []);
    } catch (error) {
      console.error('Error fetching manpower:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManpower();
    
    // Listen for project updates (which might affect manpower allocation)
    const unsubscribe = onProjectUpdate(() => {
      fetchManpower();
    });

    return unsubscribe;
  }, []);

  // Calculate metrics
  const totalWorkforce = manpower.length;
  
  // Calculate status-based counts using the same logic as the table
  const availableCount = manpower.filter(p => computeStatus(p) === "Available").length;
  const busyCount = manpower.filter(p => computeStatus(p) === "Busy").length;
  const overloadedCount = manpower.filter(p => computeStatus(p) === "Overloaded").length;
  
  // Currently busy = Busy + Overloaded
  const currentlyBusy = busyCount + overloadedCount;
  
  // Calculate average workload (average number of active projects per person)
  const avgWorkload = totalWorkforce > 0
    ? (manpower.reduce((sum, p) => sum + p.active_projects_count, 0) / totalWorkforce).toFixed(1)
    : 0;

  // Calculate utilization rate (busy + overloaded)
  const utilizationRate = totalWorkforce > 0
    ? ((currentlyBusy / totalWorkforce) * 100).toFixed(0)
    : 0;

  // Show loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse"
          >
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="mt-3 flex items-end justify-between">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* Total Workforce */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total Workforce
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {totalWorkforce}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-500">
              {utilizationRate}% utilized
            </span>
          </div>
        </div>
      </div>

      {/* Currently Busy */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Currently Busy
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {currentlyBusy}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600 dark:bg-orange-500/15 dark:text-orange-500">
              on active projects
            </span>
          </div>
        </div>
      </div>

      {/* Currently Available */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Currently Available
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {availableCount}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600 dark:bg-green-500/15 dark:text-green-500">
              {totalWorkforce > 0
                ? ((availableCount / totalWorkforce) * 100).toFixed(0)
                : 0}
              % free
            </span>
          </div>
        </div>
      </div>

      {/* Average Workload per Person */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Avg. Workload per Person
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {avgWorkload}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                Number(avgWorkload) > 3
                  ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500"
                  : Number(avgWorkload) > 2
                  ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500"
                  : "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500"
              }`}
            >
              {Number(avgWorkload) > 3
                ? "High load"
                : Number(avgWorkload) > 2
                ? "Moderate"
                : "Balanced"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};