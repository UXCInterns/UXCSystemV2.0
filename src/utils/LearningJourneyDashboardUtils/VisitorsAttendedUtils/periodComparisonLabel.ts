import type { Period } from '@/context/PeriodContext';

export const getPeriodComparisonLabel = (
  isComparisonMode: boolean,
  comparisonPeriod: Period | undefined,
  currentPeriod: Period,
  getPeriodLabel: (period?: Period) => string
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