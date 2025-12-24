import { useMemo } from "react";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";
import { IndustryMetricsData } from "@/types/LearningJourneyDashboardTypes/industryMetrics";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useIndustryMetrics = () => {
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
      params.append('isComparison', 'true');
      const comparisonRange = getPeriodRange(comparisonPeriod);
      params.append('comparisonStartDate', comparisonRange.startDate);
      params.append('comparisonEndDate', comparisonRange.endDate);
    }

    return `/api/learning-journey-dashboard?${params}`;
  }, [getPeriodRange, currentPeriod, comparisonPeriod, isComparisonMode]);

  const { data, error, isLoading } = useSWR<IndustryMetricsData>(
    apiUrl, 
    fetcher, 
    { refreshInterval: 30000 }
  );

  return {
    data,
    error,
    isLoading,
    getPeriodLabel,
  };
};