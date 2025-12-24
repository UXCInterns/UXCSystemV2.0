import { useMemo } from "react";
import useSWR from "swr";
import { usePeriod } from "@/context/PeriodContext";
import { TimelineData } from "@/types/LearningJourneyDashboardTypes/visitorsTimeline";
import { processTimelineData } from "@/utils/LearningJourneyDashboardUtils/VisitorsByDateUtils/timelineDataProcessor";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useTimelineData = () => {
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

  const { data, error, isLoading } = useSWR<TimelineData>(
    `/api/learning-journey-dashboard?${params}`, 
    fetcher, 
    { refreshInterval: 30000 }
  );

  const processedData = useMemo(() => {
    const timeline = data?.timeline || [];
    const comparisonTimeline = data?.comparison?.timeline || [];
    return processTimelineData(timeline, comparisonTimeline, isComparisonMode);
  }, [data, isComparisonMode]);

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