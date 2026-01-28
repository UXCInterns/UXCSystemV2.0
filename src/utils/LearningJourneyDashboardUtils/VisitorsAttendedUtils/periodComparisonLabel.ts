interface PeriodConfig {
  type: 'calendar' | 'financial' | 'quarterly' | 'custom';
  startDate?: string;
  endDate?: string;
  year?: number;
  quarter?: number;
  [key: string]: unknown; // Allow additional properties
}

export const getPeriodComparisonLabel = (
  isComparisonMode: boolean,
  comparisonPeriod: PeriodConfig | null,
  currentPeriod: PeriodConfig,
  getPeriodLabel: (period?: PeriodConfig) => string
): string => {
  if (!isComparisonMode || !comparisonPeriod) {
    switch (currentPeriod.type) {
      case "calendar":
        return `previous calendar year`;
      case "financial":
        return `previous financial year`;
      case "quarterly":
        return `previous quarter`;
      case "custom":
        return `previous period`;
      default:
        return `previous period`;
    }
  }
  return getPeriodLabel(comparisonPeriod);
};