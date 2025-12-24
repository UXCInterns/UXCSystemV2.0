"use client";

import React from "react";
import { MetricStatCard } from "@/components/ui/metric/MetricStatCard";
import { useManpowerData } from "@/hooks/ManpowerHooks/useManpowerData";
import { calculateManpowerStats, getWorkloadBadge } from "@/utils/ManpowerUtils/ManpowerMetricsUtils/manpowerCalculations";
import { MetricsLoadingSkeleton } from "./MetricsLoadingSkeleton";

export const ManpowerMetrics = () => {
  const { manpower, loading } = useManpowerData();

  if (loading) {
    return <MetricsLoadingSkeleton />;
  }

  const stats = calculateManpowerStats(manpower);
  const workloadBadge = getWorkloadBadge(stats.avgWorkload);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      <MetricStatCard
        label="Total Workforce"
        value={stats.totalWorkforce}
        badgeText={`${stats.utilizationRate}% utilized`}
        badgeColor="blue"
      />

      <MetricStatCard
        label="Currently Busy"
        value={stats.currentlyBusy}
        badgeText="on active projects"
        badgeColor="orange"
      />

      <MetricStatCard
        label="Currently Available"
        value={stats.availableCount}
        badgeText={`${stats.availabilityRate}% free`}
        badgeColor="green"
      />

      <MetricStatCard
        label="Avg. Workload per Person"
        value={stats.avgWorkload}
        badgeText={workloadBadge.text}
        badgeColor={workloadBadge.color}
      />
    </div>
  );
};