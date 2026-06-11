"use client";

import { useEffect, useMemo } from "react";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";

const fetcher = (url: string) => fetch(url).then(res => res.json());

type LearningJourneyRow = {
  duration: number;
  date_of_visit: string;
};

const MAX_HOURS = 100;
const MAX_HOURS_MINUTES = MAX_HOURS * 60;

export function useTotalHoursMetrics() {
  const {
    getPeriodRange,
    currentPeriod,
    comparisonPeriod,
    isComparisonMode,
  } = usePeriod();

  // =========================
  // SAME FILTER PATTERN AS VISITORS
  // =========================
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

  // =========================
  // FETCH DATA
  // =========================
  const { data, error, isLoading } = useSWR(
    `/api/learning-journey-dashboard?${params}`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  // =========================
  // SAFE PROCESSING
  // =========================
  const processedData = useMemo(() => {
    const rows: LearningJourneyRow[] = data?.timeline || [];

    // IMPORTANT FIX:
    // we calculate from timeline OR fallback if needed
    const totalMinutes = rows.reduce((sum: number, row: LearningJourneyRow) => {
      return sum + (row.duration || 0);
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const percentage = Math.min(
      (totalMinutes / MAX_HOURS_MINUTES) * 100,
      100
    );

    return {
      totalMinutes,
      hours,
      minutes,
      percentage,
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