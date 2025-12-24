// Utility for calculating comparison period date ranges
import { DateRange } from "@/types/LearningJourneyDashboardTypes/visitorsMetrics";

interface PeriodConfig {
  type: string;
  year: number;
  quarter?: number;
  startDate?: string;
  endDate?: string;
}

export const getComparisonDateRange = (period: PeriodConfig): DateRange => {
  if (period.type === 'custom' && period.startDate && period.endDate) {
    return {
      startDate: period.startDate,
      endDate: period.endDate
    };
  }
  
  if (period.type === 'quarterly') {
    const year = period.year;
    const quarter = period.quarter || 1;
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 2;
    return {
      startDate: `${year}-${(startMonth + 1).toString().padStart(2, '0')}-01`,
      endDate: `${year}-${(endMonth + 1).toString().padStart(2, '0')}-${new Date(year, endMonth + 1, 0).getDate()}`
    };
  }
  
  if (period.type === 'financial') {
    return {
      startDate: `${period.year}-04-01`,
      endDate: `${period.year + 1}-03-31`
    };
  }
  
  // Calendar year
  return {
    startDate: `${period.year}-01-01`,
    endDate: `${period.year}-12-31`
  };
};