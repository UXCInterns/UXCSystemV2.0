"use client";

import React, { useState } from "react";
import Badge from "../ui/badge/Badge";
import { GroupIcon, BoltIcon } from "@/icons";
import { usePeriod } from "@/context/PeriodContext";
import useSWR from "swr";

// SWR fetcher
const fetcher = (url: string) => fetch(url).then(res => res.json());

interface MetricProps {
  icon: React.ReactNode;
  titleTop: string;
  titleBottom: string;
  value: string;
  badgeText?: string;
  companies?: string[];
  loading?: boolean;
  comparisonValue?: string; // New prop for comparison mode
}

const MetricCard: React.FC<MetricProps> = ({
  icon,
  titleTop,
  titleBottom,
  value,
  badgeText,
  companies,
  loading = false,
  comparisonValue,
}) => {
  const [flipped, setFlipped] = useState(false);

  if (loading) {
    return (
      <div className="relative w-full">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div className="flex flex-col leading-tight gap-2">
              <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className={`inset-0 transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 [backface-visibility:hidden]">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {icon}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {titleTop}
              </span>
              <span className="text-base text-gray-800 dark:text-white/90">
                {titleBottom}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <h2 className="font-bold text-gray-800 text-xl dark:text-white/90">
              {value}
            </h2>
            {comparisonValue && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                vs
              </span>
            )}
          </div>

          {badgeText && (
            <div className="mt-0">
              <Badge color={comparisonValue ? "warning" : "primary"}>
                <span className="text-xs">
                  {comparisonValue || badgeText}
                </span>
              </Badge>
            </div>
          )}
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto custom-scrollbar">
          <h4 className="font-semibold mb-3 text-md">Companies</h4>
          {companies && companies.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-400">
              {companies.map((name, i) => (
                <li
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-800 pb-2"
                >
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

interface MetricsData {
  mostVisitedIndustry: string;
  secondMostVisitedIndustry: string;
  mostVisitedSector: string;
  secondMostVisitedSector: string;
  industryCompanies: string[];
  sectorCompanies: string[];
  allIndustries: Array<[string, { count: number; companies: string[] }]>;
  allSectors: Array<[string, { count: number; companies: string[] }]>;
  // Comparison data
  comparison?: {
    mostVisitedIndustry: string;
    secondMostVisitedIndustry: string;
    mostVisitedSector: string;
    secondMostVisitedSector: string;
    industryCompanies: string[];
    sectorCompanies: string[];
    allIndustries: Array<[string, { count: number; companies: string[] }]>;
    allSectors: Array<[string, { count: number; companies: string[] }]>;
  };
  isComparison?: boolean;
}

export const IndustryMetrics = () => {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod, 
    isComparisonMode,
    getPeriodLabel 
  } = usePeriod();

  // Get primary period range
  const { startDate, endDate } = getPeriodRange();
  
  // Build URL parameters
  const params = new URLSearchParams({
    startDate,
    endDate,
    periodType: currentPeriod.type,
  });

  // Add comparison parameters if in comparison mode
  if (isComparisonMode && comparisonPeriod) {
    params.append('isComparison', 'true');
    
    // Get comparison period range
    const comparisonRange = getPeriodRange(comparisonPeriod);
    params.append('comparisonStartDate', comparisonRange.startDate);
    params.append('comparisonEndDate', comparisonRange.endDate);
  }

  const { data, error, isLoading } = useSWR<MetricsData>(
    `/api/learning-journey-dashboard?${params}`, 
    fetcher, 
    {
      refreshInterval: 30000, // refresh every 30s
    }
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <MetricCard
          icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
          titleTop="Most Visited"
          titleBottom="Industry"
          value="Loading..."
          loading={true}
        />
        <MetricCard
          icon={<BoltIcon className="text-gray-800 size-6 dark:text-white/90" />}
          titleTop="Most Visited"
          titleBottom="Sector"
          value="Loading..."
          loading={true}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">
          Failed to load metrics: {error.message}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03]">
        <p className="text-gray-500 dark:text-gray-400">
          No stats available for {getPeriodLabel().toLowerCase()}...
        </p>
      </div>
    );
  }

  // Determine badge content based on comparison mode
  const getIndustryBadge = () => {
    if (data.isComparison && data.comparison?.mostVisitedIndustry) {
      return data.comparison.mostVisitedIndustry;
    }
    return data.secondMostVisitedIndustry;
  };

  const getSectorBadge = () => {
    if (data.isComparison && data.comparison?.mostVisitedSector) {
      return data.comparison.mostVisitedSector;
    }
    return data.secondMostVisitedSector;
  };

  return (
    <div className="flex flex-col gap-6">
      <MetricCard
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
        titleTop="Most Visited"
        titleBottom="Industry"
        value={data.mostVisitedIndustry || "No Data"}
        badgeText={getIndustryBadge() || "No Data"}
        companies={data.industryCompanies}
        comparisonValue={data.isComparison ? data.comparison?.mostVisitedIndustry : undefined}
      />

      <MetricCard
        icon={<BoltIcon className="text-gray-800 size-6 dark:text-white/90" />}
        titleTop="Most Visited"
        titleBottom="Sector"
        value={data.mostVisitedSector || "No Data"}
        badgeText={getSectorBadge() || "No Data"}
        companies={data.sectorCompanies}
        comparisonValue={data.isComparison ? data.comparison?.mostVisitedSector : undefined}
      />
    </div>
  );
};