import { useMemo } from "react";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";
import { MonthlyVisitorsData, ProcessedMonthlyData } from "@/types/LearningJourneyDashboardTypes/visitorsMonthly";
import { processMonthlyBreakdown } from "@/utils/LearningJourneyDashboardUtils/VisitorsByMonthUtils/monthlyDataProcessor";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useMonthlyVisitors = () => {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    getPeriodLabel 
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
      p.append('isComparison', 'true');
      p.append('comparisonStartDate', comparisonRange.startDate);
      p.append('comparisonEndDate', comparisonRange.endDate);
    }

    return p.toString();
  }, [getPeriodRange, currentPeriod, comparisonPeriod, isComparisonMode]);

  const { data, error, isLoading } = useSWR<MonthlyVisitorsData>(
    `/api/learning-journey-dashboard?${params}`, 
    fetcher, 
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const processedData: ProcessedMonthlyData = useMemo(() => {
    const primaryResult = processMonthlyBreakdown(
      data?.periodBreakdown, 
      currentPeriod.type
    );

    let comparisonResult: { processedData: number[]; labels: string[] } = { 
      processedData: [], 
      labels: [] 
    };

    if (isComparisonMode && data?.comparison?.periodBreakdown) {
      comparisonResult = processMonthlyBreakdown(
        data.comparison.periodBreakdown, 
        comparisonPeriod?.type || currentPeriod.type
      );
    }

    return {
      primaryData: primaryResult.processedData,
      comparisonData: comparisonResult.processedData,
      labels: primaryResult.labels
    };
  }, [data, currentPeriod.type, comparisonPeriod?.type, isComparisonMode]);

  return {
    ...processedData,
    isLoading,
    error,
    getPeriodLabel,
    currentPeriod,
    comparisonPeriod,
    isComparisonMode,
  };
};