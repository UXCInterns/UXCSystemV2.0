// components/StatsMetrics.tsx
"use client";

import React, { useState, useMemo } from "react";
import useSWR from "swr";
import Image from "next/image";
import Badge from "../ui/badge/Badge";
import { usePeriod } from "@/context/PeriodContext";
import PeriodSelector from "../period/PeriodContext";
import { ArrowDownIcon, ArrowUpIcon, ShootingStarIcon, GroupIcon, BoltIcon } from "@/icons";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MetricCard = ({ icon, title, value, badge, companies, comparisonValue, loading = false,}:
{
  icon: React.ReactNode;
  title: string;
  value: string;
  badge: React.ReactNode;
  companies: string[];
  comparisonValue?: string;
  loading?: boolean;
}) => {
  const [flipped, setFlipped] = useState(false);

  if (loading) {
    return (
      <div className="relative w-full">
        <div className="inset-0 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            <div className="flex flex-col leading-tight space-y-2">
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full cursor-pointer [perspective:1000px]" onClick={() => setFlipped((prev) => !prev)}>
      <div className={`inset-0 transition-transform duration-500 [transform-style:preserve-3d] ${ flipped ? "[transform:rotateY(180deg)]" : "" }`}>
        {/* Front */}
        <div className="inset-0 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 [backface-visibility:hidden]">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {icon}
            </div>
            <div className="flex flex-col leading-tight">
              {title === "Visited Multiple Times" ? (
                <>
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Companies Visited
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Multiple Times
                  </span>
                </>
              ) : (
                <>
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Visited
                  </span>
                </>
              )}
            </div>
          </div>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            {/* Value + Comparison */}
            <div className="flex items-baseline gap-2">
              <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                {value}
              </h4>
              {comparisonValue && (
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  vs {comparisonValue}
                </span>
              )}
            </div>

            {/* Badge with percentage change */}
            {comparisonValue && (
              (() => {
                const v = Number(value);
                const c = Number(comparisonValue);
                if (!isNaN(v) && !isNaN(c) && c > 0) {
                  const change = (((v - c) / c) * 100).toFixed(1);
                  const positive = Number(change) >= 0;

                  return (
                    <Badge variant="light" size="sm" color={positive ? "success" : "error"}>
                      {positive ? "+" : ""}
                      {change}%
                    </Badge>
                  );
                }
                return null;
              })()
            )}
          </div>
        </div>

        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto custom-scrollbar">
          <h4 className="font-semibold mb-3 text-md">Companies</h4>
          {companies.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-400">
              {companies.map((name, i) => (
                <li key={i} className="border-b border-gray-100 dark:border-gray-800 pb-2">
                  {name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No companies found for this period.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const StatsMetrics = () => {
  const {  getPeriodRange, getPeriodLabel, currentPeriod, comparisonPeriod, isComparisonMode } = usePeriod();

  // Build API URL with support for comparison
  const apiUrl = useMemo(() => {
    const primaryRange = getPeriodRange(currentPeriod);
    const params = new URLSearchParams({
      startDate: primaryRange.startDate,
      endDate: primaryRange.endDate,
      periodType: currentPeriod.type,
    });

    // Add comparison parameters if comparison mode is enabled
    if (isComparisonMode && comparisonPeriod) {
      const comparisonRange = getPeriodRange(comparisonPeriod);
      params.append('isComparison', 'true');
      params.append('comparisonStartDate', comparisonRange.startDate);
      params.append('comparisonEndDate', comparisonRange.endDate);
    }

    return `/api/learning-journey-dashboard?${params}`;
  }, [currentPeriod, comparisonPeriod, isComparisonMode, getPeriodRange]);

  const { data, error, isLoading } = useSWR(apiUrl, fetcher, {
    refreshInterval: 60_000, // refresh every 60s
    revalidateOnFocus: true, // auto-refresh when user switches back to tab
  });

  // Primary period data
  const companies = data?.companies || [];
  const totalCompanies = data?.totalCompanies || 0;
  const uniqueCompanies = data?.uniqueCompanies || [];
  const multipleVisits = data?.multipleVisits || [];

  // Comparison period data
  const comparisonData = data?.comparison;
  const comparisonMetrics = data?.comparisonMetrics;
  const hasComparison = data?.isComparison && comparisonData;

  const getBadgeColor = (change: string | number) => {
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    if (numChange === 0) return "primary";
    return numChange > 0 ? "success" : "error";
  };

  const getBadgeIcon = (change: string | number) => {
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    if (numChange === 0) return null;
    return numChange > 0 ? (
      <ArrowUpIcon className="w-3 h-3" />
    ) : (
      <ArrowDownIcon className="w-3 h-3" />
    );
  };

  const formatChange = (change: string | number) => {
    const numChange = typeof change === "string" ? parseFloat(change) : change;
    if (numChange === 0) return "0%";
    return `${numChange > 0 ? "+" : ""}${numChange}%`;
  };

  // Helper function to create metric badges
  const createMetricBadge = (changeValue: string | undefined, fallbackText: string = "--") => {
    if (!changeValue || !hasComparison) {
      return (
        <Badge color="primary">
          {fallbackText}
        </Badge>
      );
    }

    const icon = getBadgeIcon(changeValue);
    return (
      <Badge color={getBadgeColor(changeValue)}>
        {icon}
        {formatChange(changeValue)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            UXC Metrics
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getPeriodLabel(currentPeriod)}
            {hasComparison && (
              <>
                {" vs "}
                <span className="text-blue-600 dark:text-blue-400">
                  {getPeriodLabel(comparisonPeriod)}
                </span>
              </>
            )}
            {" Overview"}
          </p>
        </div>
        <PeriodSelector />
      </div>

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
        {/* Light Logo */}
        <div className="rounded-2xl border border-gray-200 p-6 dark:hidden dark:border-gray-800 bg-white flex items-center justify-center">
          <Image src="/images/logo/UXCLJ.png" alt="Light mode logo" width={250} height={120} className="rounded-lg"/>
        </div>

        {/* Dark Logo */}
        <div className="hidden dark:flex rounded-2xl border border-gray-800 p-6 dark:bg-white/[0.03] items-center justify-center">
          <Image src="/images/logo/UXCLJ-dark.png" alt="Dark mode logo" width={250} height={120} className="rounded-lg"/>
        </div>

        <MetricCard
          icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
          title="Total Companies"
          value={totalCompanies.toString()}
          badge={createMetricBadge(comparisonMetrics?.totalCompaniesChange)}
          companies={companies}
          comparisonValue={hasComparison ? comparisonData.totalCompanies.toString() : undefined}
          loading={isLoading}
        />

        <MetricCard
          icon={<ShootingStarIcon className="text-gray-800 dark:text-white/90" />}
          title="Unique Companies"
          value={uniqueCompanies.length.toString()}
          badge={createMetricBadge(comparisonMetrics?.uniqueCompaniesChange)}
          companies={uniqueCompanies}
          comparisonValue={hasComparison ? comparisonData.uniqueCompanies.length.toString() : undefined}
          loading={isLoading}
        />

        <MetricCard
          icon={<BoltIcon className="text-gray-800 dark:text-white/90" />}
          title="Visited Multiple Times"
          value={multipleVisits.length.toString()}
          badge={
            hasComparison ? (
              <Badge 
                color={
                  multipleVisits.length === comparisonData.multipleVisits.length 
                    ? "success" 
                    : multipleVisits.length > comparisonData.multipleVisits.length 
                    ? "warning" 
                    : "primary"
                }
              >
                {multipleVisits.length === comparisonData.multipleVisits.length ? (
                  "Same"
                ) : multipleVisits.length > comparisonData.multipleVisits.length ? (
                  <>
                    <ArrowUpIcon className="w-3 h-3" />
                    More
                  </>
                ) : (
                  <>
                    <ArrowDownIcon className="w-3 h-3" />
                    Less
                  </>
                )}
              </Badge>
            ) : (
              <Badge color={multipleVisits.length > 0 ? "warning" : "primary"}>
                {multipleVisits.length > 0 ? "Active" : "None"}
              </Badge>
            )
          }
          companies={multipleVisits}
          comparisonValue={hasComparison ? comparisonData.multipleVisits.length.toString() : undefined}
          loading={isLoading}
        />
      </div>
    </div>
  );
};