interface PeriodConfig {
  type: string;
}

export const getPeriodComparisonLabel = (
  isComparisonMode: boolean,
  comparisonPeriod: any,
  currentPeriod: PeriodConfig,
  getPeriodLabel: (period?: any) => string
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