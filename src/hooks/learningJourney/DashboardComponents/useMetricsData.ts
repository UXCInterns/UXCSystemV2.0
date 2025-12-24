// Hook for fetching metrics data with SWR and period comparison support
import { useMemo } from "react";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";
import { MetricsData } from "@/types/LearningJourneyDashboardTypes/metrics";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useMetricsData = () => {
  const { getPeriodRange, currentPeriod, comparisonPeriod, isComparisonMode } = usePeriod();

  const apiUrl = useMemo(() => {
    const primaryRange = getPeriodRange(currentPeriod);
    const params = new URLSearchParams({
      startDate: primaryRange.startDate,
      endDate: primaryRange.endDate,
      periodType: currentPeriod.type,
    });

    if (isComparisonMode && comparisonPeriod) {
      const comparisonRange = getPeriodRange(comparisonPeriod);
      params.append('isComparison', 'true');
      params.append('comparisonStartDate', comparisonRange.startDate);
      params.append('comparisonEndDate', comparisonRange.endDate);
    }

    return `/api/learning-journey-dashboard?${params}`;
  }, [currentPeriod, comparisonPeriod, isComparisonMode, getPeriodRange]);

  const { data, error, isLoading } = useSWR<MetricsData>(apiUrl, fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  });

  return {
    data,
    error,
    isLoading,
    hasComparison: data?.isComparison && data?.comparison,
  };
};