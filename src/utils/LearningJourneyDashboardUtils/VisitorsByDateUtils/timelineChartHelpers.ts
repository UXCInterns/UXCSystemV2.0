interface PeriodConfig {
  type: 'calendar' | 'financial' | 'quarterly' | 'custom';
  startDate?: string;
  endDate?: string;
  year?: number;
  quarter?: number;
  [key: string]: unknown; // Allow additional properties
}

export const getChartTitle = (
  isComparisonMode: boolean,
  comparisonPeriod: PeriodConfig | null,
  getPeriodLabel: () => string
): string => {
  if (isComparisonMode && comparisonPeriod) {
    return `Visitors Timeline Comparison`;
  }
  return `Visitors Timeline - ${getPeriodLabel()}`;
};

export const getChartSubtitle = (
  categories: string[],
  primarySeries: number[],
  comparisonSeries: number[],
  isComparisonMode: boolean,
  comparisonPeriod: PeriodConfig | null,
  currentPeriod: PeriodConfig,
  getPeriodLabel: (period?: PeriodConfig) => string
): string => {
  if (categories.length === 0) return "No visits recorded for this period";

  if (isComparisonMode && comparisonPeriod) {
    return `${getPeriodLabel()} vs ${getPeriodLabel(comparisonPeriod)}`;
  }

  const visitCount = primarySeries.filter(v => v > 0).length;
  
  switch (currentPeriod.type) {
    case 'quarterly':
      return `${visitCount} visits recorded in ${getPeriodLabel()}`;
    case 'financial':
      return `${visitCount} visits across financial year`;
    case 'custom':
      return `${visitCount} visits in selected date range`;
    default:
      return `${visitCount} individual visits by date`;
  }
};