// Type definitions for visitors attended metrics
export interface VisitorsMetricsData {
  totalVisitors: number;
  comparison?: {
    totalVisitors: number;
  };
  isComparison?: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}