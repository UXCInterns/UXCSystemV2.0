"use client";

import React from "react";
import Badge from "../ui/badge/Badge";
import { Clock, Calendar } from "lucide-react";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";
import { usePeriod } from "@/context/PeriodContext";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface MetricProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  value: string;
  badgeText?: string;
  badgeText2?: string;
  loading?: boolean;
  comparisonValue?: string;
  comparisonValue2?: string;
  hasComparison?: boolean;
  percentageChange?: number | null;
  percentageChange2?: number | null;
  showPercentageForBadges?: boolean;
}

const MetricCard: React.FC<MetricProps> = ({
  icon,
  title,
  subtitle,
  value,
  badgeText,
  badgeText2,
  loading = false,
  comparisonValue,
  comparisonValue2,
  hasComparison = false,
  percentageChange = null,
  percentageChange2 = null,
  showPercentageForBadges = false,
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          <div className="flex flex-col leading-tight space-y-2">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {icon}
        </div>
        <div>
          <span className="text-base font-medium text-gray-700 dark:text-white">
            {title}
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between mt-4">
        {/* Show value if no badges, otherwise show badges */}
        {!badgeText ? (
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold text-gray-800 dark:text-white/90">
              {value}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            {hasComparison && comparisonValue && (
              <span className="text-sm text-blue-600 dark:text-blue-400">
                vs {comparisonValue}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge color="primary">
                {badgeText}
              </Badge>
              {comparisonValue && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  total {comparisonValue}
                </span>
              )}
            </div>
            
            {badgeText2 && (
              <div className="flex items-center gap-2">
                <Badge color="warning">
                  {badgeText2}
                </Badge>
                {comparisonValue2 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    total {comparisonValue2}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 items-end">
          {!badgeText && hasComparison && (
            percentageChange !== null ? (
              <Badge color={percentageChange >= 0 ? "success" : "error"}>
                {percentageChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {Math.abs(percentageChange).toFixed(1)}%
              </Badge>
            ) : (
              <Badge color="primary">
                --
              </Badge>
            )
          )}
          
          {showPercentageForBadges && hasComparison && percentageChange !== null && (
            <Badge color={percentageChange >= 0 ? "success" : "error"}>
              {percentageChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {Math.abs(percentageChange).toFixed(1)}%
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

interface DurationMetricsProps {
  programType?: "pace" | "non_pace";
}

export const DurationMetrics: React.FC<DurationMetricsProps> = ({ programType }) => {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod, 
    isComparisonMode 
  } = usePeriod();

  const { startDate, endDate } = getPeriodRange();
  const comparisonRange = comparisonPeriod ? getPeriodRange(comparisonPeriod) : null;

  const params = React.useMemo(() => {
    const p = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });

    if (programType) {
      p.set("programType", programType);
    }

    if (isComparisonMode && comparisonPeriod && comparisonRange) {
      p.append("isComparison", "true");
      p.append("comparisonStartDate", comparisonRange.startDate);
      p.append("comparisonEndDate", comparisonRange.endDate);
    }

    return p.toString();
  }, [startDate, endDate, currentPeriod.type, programType, isComparisonMode, comparisonPeriod, comparisonRange]);

  const { data, error, isLoading } = useSWR(`/api/workshops-dashboard?${params}`, fetcher, {
    refreshInterval: 30000,
  });

  const metrics = data?.metrics?.primary;
  const comparisonMetrics = data?.metrics?.comparison;
  const hasComparison = data?.isComparison && comparisonMetrics;

  // Calculate average course hours
  const avgCourseHours = metrics?.averageCourseHours || 0;
  const comparisonAvgCourseHours = comparisonMetrics?.averageCourseHours || 0;
  
  const avgHoursChange = hasComparison && comparisonAvgCourseHours > 0
    ? ((avgCourseHours - comparisonAvgCourseHours) / comparisonAvgCourseHours) * 100
    : null;

  // Calculate average duration (in days)
  const avgDuration = metrics?.averageDurationDays || 0;
  const comparisonAvgDuration = comparisonMetrics?.averageDurationDays || 0;
  
  const avgDurationChange = hasComparison && comparisonAvgDuration > 0
    ? ((avgDuration - comparisonAvgDuration) / comparisonAvgDuration) * 100
    : null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <MetricCard
          icon={<Clock className="text-gray-800 size-6 dark:text-white/90" />}
          title="Average Course"
          subtitle="Hours"
          value="Loading..."
          loading={true}
        />
        <MetricCard
          icon={<Calendar className="text-gray-800 size-6 dark:text-white/90" />}
          title="Average Duration"
          subtitle="Days"
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

  return (
    <div className="flex flex-col gap-6">
      <MetricCard
        icon={<Clock className="text-gray-800 dark:text-white/90" size={24} strokeWidth={1.5} />}
        title="Average Course"
        subtitle="Hours"
        value={`${avgCourseHours}`}
        comparisonValue={hasComparison ? `${comparisonAvgCourseHours}` : undefined}
        hasComparison={hasComparison}
        percentageChange={avgHoursChange}
      />

      <MetricCard
        icon={<Calendar className="text-gray-800 dark:text-white/90" size={24} strokeWidth={1.5} />}
        title="Average Duration"
        subtitle="Days"
        value={`${avgDuration}`}
        comparisonValue={hasComparison ? `${comparisonAvgDuration}` : undefined}
        hasComparison={hasComparison}
        percentageChange={avgDurationChange}
      />
    </div>
  );
};
