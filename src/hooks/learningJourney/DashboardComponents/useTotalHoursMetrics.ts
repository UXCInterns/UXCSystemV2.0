"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTotalHoursMetrics() {
  const {
    getPeriodRange,
    currentPeriod,
    comparisonPeriod,
    isComparisonMode,
  } = usePeriod();

  const params = useMemo(() => {
    const { startDate, endDate } = getPeriodRange();

    const p = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });

    if (isComparisonMode && comparisonPeriod) {
      const comparisonRange = getPeriodRange(comparisonPeriod);

      p.append("isComparison", "true");
      p.append("comparisonStartDate", comparisonRange.startDate);
      p.append("comparisonEndDate", comparisonRange.endDate);
    }

    return p.toString();
  }, [getPeriodRange, currentPeriod, comparisonPeriod, isComparisonMode]);

  // 🔥 FIX: stable SWR key (THIS FIXES YOUR STUCK VALUE ISSUE)
  const swrKey = useMemo(() => {
    return `/api/learning-journey-dashboard?${params}`;
  }, [params]);

  const { data, error, isLoading } = useSWR(swrKey, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const processedData = useMemo(() => {
  const totalMinutes = data?.totalDuration || 0;

  const comparisonTotalMinutes =
    data?.comparison?.totalDuration || 0;

  return {
    totalMinutes,
    comparisonTotalMinutes,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
}, [data]);

  return {
    data: processedData,
    isLoading,
    error,
    currentPeriod,
    comparisonPeriod,
    isComparisonMode,
  };
}