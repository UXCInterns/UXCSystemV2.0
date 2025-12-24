import { MonthlyBreakdownItem } from "@/types/LearningJourneyDashboardTypes/visitorsMonthly";
import { CALENDAR_MONTHS, FINANCIAL_MONTHS } from "@/constants/LearningJourneyDashboardConstants/monthConstants";

interface ProcessedResult {
  processedData: number[];
  labels: string[];
}

export const processMonthlyBreakdown = (
  breakdown: MonthlyBreakdownItem[] | undefined,
  periodType: string
): ProcessedResult => {
  if (!breakdown) return { processedData: [], labels: CALENDAR_MONTHS };

  switch (periodType) {
    case "quarterly":
      return processQuarterlyData(breakdown);
    case "financial":
      return processFinancialData(breakdown);
    case "custom":
      return processCustomData(breakdown);
    default:
      return processCalendarData(breakdown);
  }
};

const processQuarterlyData = (breakdown: MonthlyBreakdownItem[]): ProcessedResult => {
  const quarterData: number[] = [];
  const quarterLabels: string[] = [];

  breakdown.forEach((item) => {
    if (item.monthName && typeof item.total === "number") {
      quarterLabels.push(item.monthName);
      quarterData.push(item.total);
    }
  });

  // Pad to 3 months if needed
  while (quarterLabels.length < 3) {
    quarterLabels.push("N/A");
    quarterData.push(0);
  }

  return { processedData: quarterData, labels: quarterLabels };
};

const processFinancialData = (breakdown: MonthlyBreakdownItem[]): ProcessedResult => {
  const yearlyData = Array(12).fill(0) as number[];

  breakdown.forEach((item) => {
    if (item.monthName && typeof item.total === "number") {
      const monthIndex = CALENDAR_MONTHS.indexOf(item.monthName);
      if (monthIndex !== -1) {
        const finIndex = (monthIndex + 9) % 12;
        yearlyData[finIndex] = item.total;
      }
    }
  });

  return { processedData: yearlyData, labels: FINANCIAL_MONTHS };
};

const processCustomData = (breakdown: MonthlyBreakdownItem[]): ProcessedResult => {
  const customData: number[] = [];
  const customLabels: string[] = [];

  breakdown.forEach((item) => {
    if (item.monthName && typeof item.total === "number") {
      customLabels.push(item.monthName);
      customData.push(item.total);
    }
  });

  return { processedData: customData, labels: customLabels };
};

const processCalendarData = (breakdown: MonthlyBreakdownItem[]): ProcessedResult => {
  const yearlyData = Array(12).fill(0) as number[];

  breakdown.forEach((item) => {
    if (item.monthName && typeof item.total === "number") {
      const monthIndex = CALENDAR_MONTHS.indexOf(item.monthName);
      if (monthIndex !== -1) {
        yearlyData[monthIndex] = item.total;
      }
    }
  });

  return { processedData: yearlyData, labels: CALENDAR_MONTHS };
};