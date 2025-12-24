"use client";

import React from "react";
import { GroupIcon, ShootingStarIcon, BoltIcon } from "@/icons";
import { useMetricsData } from "@/hooks/learningJourney/DashboardComponents/useMetricsData";
import { MetricsHeader } from "./MetricsHeader";
import { LogoCard } from "./LogoCard";
import { MetricCard } from "./MetricCard";
import { createMetricBadge } from "./MetricBadgeFactory";
import { MultipleVisitsBadge } from "./MultipleVisitsBadge";

export const StatsMetrics = () => {
  const { data, error, isLoading, hasComparison } = useMetricsData();

  const companies = data?.companies || [];
  const totalCompanies = data?.totalCompanies || 0;
  const uniqueCompanies = data?.uniqueCompanies || [];
  const multipleVisits = data?.multipleVisits || [];

  const comparisonData = data?.comparison;
  const comparisonMetrics = data?.comparisonMetrics;

  return (
    <div className="space-y-6">
      <MetricsHeader hasComparison={!!hasComparison} />

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load data. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <LogoCard />

        <MetricCard
          icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
          title="Total Companies"
          value={totalCompanies.toString()}
          badge={createMetricBadge(
            comparisonMetrics?.totalCompaniesChange,
            !!hasComparison
          )}
          companies={companies}
          comparisonValue={
            hasComparison ? comparisonData?.totalCompanies.toString() : undefined
          }
          loading={isLoading}
        />

        <MetricCard
          icon={<ShootingStarIcon className="text-gray-800 dark:text-white/90" />}
          title="Unique Companies"
          value={uniqueCompanies.length.toString()}
          badge={createMetricBadge(
            comparisonMetrics?.uniqueCompaniesChange,
            !!hasComparison
          )}
          companies={uniqueCompanies}
          comparisonValue={
            hasComparison ? comparisonData?.uniqueCompanies.length.toString() : undefined
          }
          loading={isLoading}
        />

        <MetricCard
          icon={<BoltIcon className="text-gray-800 dark:text-white/90" />}
          title="Visited Multiple Times"
          value={multipleVisits.length.toString()}
          badge={
            <MultipleVisitsBadge
              currentCount={multipleVisits.length}
              comparisonCount={comparisonData?.multipleVisits.length}
              hasComparison={!!hasComparison}
            />
          }
          companies={multipleVisits}
          comparisonValue={
            hasComparison ? comparisonData?.multipleVisits.length.toString() : undefined
          }
          loading={isLoading}
        />
      </div>
    </div>
  );
};