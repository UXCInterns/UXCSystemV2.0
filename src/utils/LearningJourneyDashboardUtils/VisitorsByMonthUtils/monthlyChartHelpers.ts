interface PeriodConfig {
  type: string;
  year: number;
  quarter?: number;
}

export const getMonthlyChartTitle = (
  isComparisonMode: boolean,
  comparisonPeriod: PeriodConfig | null,
  currentPeriod: PeriodConfig,
  getPeriodLabel: () => string
): string => {
  if (isComparisonMode && comparisonPeriod) {
    return `Visitors by Month - Comparison`;
  }

  switch (currentPeriod.type) {
    case "quarterly":
      return `Visitors by Month (${getPeriodLabel()})`;
    case "financial":
      return `Visitors by Month (Financial Year ${currentPeriod.year}-${currentPeriod.year + 1})`;
    case "custom":
      return `Visitors by Month (Custom Range)`;
    default:
      return `Visitors by Month (${currentPeriod.year})`;
  }
};

export const getMonthlyChartSubtitle = (
  isComparisonMode: boolean,
  comparisonPeriod: PeriodConfig | null,
  getPeriodLabel: (period?: PeriodConfig) => string
): string => {
  if (isComparisonMode && comparisonPeriod) {
    return `${getPeriodLabel()} vs ${getPeriodLabel(comparisonPeriod)}`;
  }
  return getPeriodLabel();
};

export const calculatePeakMonth = (data: number[], labels: string[]): string => {
  if (data.length === 0 || Math.max(...data) === 0) return "N/A";
  const peakIndex = data.indexOf(Math.max(...data));
  return labels[peakIndex] || "N/A";
};

export const calculateTotal = (data: number[]): number => {
  return data.reduce((sum, val) => sum + val, 0);
};