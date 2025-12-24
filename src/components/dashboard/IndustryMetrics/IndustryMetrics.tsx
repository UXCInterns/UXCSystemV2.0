"use client";

import React from "react";
import { GroupIcon, BoltIcon } from "@/icons";
import { useIndustryMetrics } from "@/hooks/learningJourney/DashboardComponents/useIndustryMetrics";
import { getIndustryBadge, getSectorBadge } from "@/utils/LearningJourneyDashboardUtils/IndustryMetricsUtils/industryBadgeHelpers";
import { IndustryMetricCard } from "./IndustryMetricCard";
import { IndustryMetricsLoadingState } from "./IndustryMetricsLoadingState";
import { IndustryMetricsErrorState } from "./IndustryMetricsErrorState";
import { IndustryMetricsEmptyState } from "./IndustryMetricsEmptyState";

export const IndustryMetrics = () => {
  const { data, error, isLoading, getPeriodLabel } = useIndustryMetrics();

  if (isLoading) {
    return <IndustryMetricsLoadingState />;
  }

  if (error) {
    return <IndustryMetricsErrorState error={error} />;
  }

  if (!data) {
    return <IndustryMetricsEmptyState periodLabel={getPeriodLabel()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <IndustryMetricCard
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
        titleTop="Most Visited"
        titleBottom="Industry"
        value={data.mostVisitedIndustry || "No Data"}
        badgeText={getIndustryBadge(data) || "No Data"}
        companies={data.industryCompanies}
        comparisonValue={data.isComparison ? data.comparison?.mostVisitedIndustry : undefined}
      />

      <IndustryMetricCard
        icon={<BoltIcon className="text-gray-800 size-6 dark:text-white/90" />}
        titleTop="Most Visited"
        titleBottom="Sector"
        value={data.mostVisitedSector || "No Data"}
        badgeText={getSectorBadge(data) || "No Data"}
        companies={data.sectorCompanies}
        comparisonValue={data.isComparison ? data.comparison?.mostVisitedSector : undefined}
      />
    </div>
  );
};