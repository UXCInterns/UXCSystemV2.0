import { useMemo } from "react";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";
import { VisitorsMetricsData } from "@/types/LearningJourneyDashboardTypes/visitorsMetrics";
import { getComparisonDateRange } from "@/utils/LearningJourneyDashboardUtils/VisitorsAttendedUtils/comparisonDateRange";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useVisitorsMetrics = () => {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    getPeriodLabel 
  } = usePeriod();

  const apiUrl = useMemo(() => {
    const { startDate, endDate } = getPeriodRange();
    const params = new URLSearchParams({
      startDate,
      endDate,
      periodType: currentPeriod.type,
    });

    if (isComparisonMode && comparisonPeriod) {
      params.set('isComparison', 'true');
      const comparisonRange = getComparisonDateRange(comparisonPeriod);
      params.set('comparisonStartDate', comparisonRange.startDate);
      params.set('comparisonEndDate', comparisonRange.endDate);
    }

    return `/api/learning-journey-dashboard?${params}`;
  }, [getPeriodRange, currentPeriod, comparisonPeriod, isComparisonMode]);

  const { data, error, isLoading } = useSWR<VisitorsMetricsData>(
    apiUrl, 
    fetcher, 
    {
      refreshInterval: 30000,
      revalidateOnFocus: false
    }
  );

  return {
    data,
    error,
    isLoading,
    getPeriodLabel,
    currentPeriod,
    comparisonPeriod,
    isComparisonMode,
  };
};