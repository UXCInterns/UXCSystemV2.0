import useSWR from 'swr';
import { ConversionData } from '@/types/LearningJourneyDashboardTypes/conversionsOverview';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface UseConversionDataParams {
  startDate: string;
  endDate: string;
  periodType: string;
  isComparisonMode: boolean;
  comparisonStartDate?: string;
  comparisonEndDate?: string;
}

export const useConversionData = ({
  startDate,
  endDate,
  periodType,
  isComparisonMode,
  comparisonStartDate,
  comparisonEndDate,
}: UseConversionDataParams) => {
  const params = new URLSearchParams({
    startDate,
    endDate,
    periodType,
  });

  if (isComparisonMode && comparisonStartDate && comparisonEndDate) {
    params.append('isComparison', 'true');
    params.append('comparisonStartDate', comparisonStartDate);
    params.append('comparisonEndDate', comparisonEndDate);
  }

  const { data, error, isLoading } = useSWR<ConversionData>(
    `/api/learning-journey-dashboard?${params}`,
    fetcher,
    {
      refreshInterval: 30000, // auto-refresh every 30s
    }
  );

  return { data, error, isLoading };
};