export interface TimelineEntry {
  date: string;
  total: number;
  company_name?: string;
}

export interface TimelineData {
  timeline: TimelineEntry[];
  comparison?: {
    timeline: TimelineEntry[];
  };
  isComparison?: boolean;
}

export interface ProcessedTimelineData {
  primarySeries: number[];
  comparisonSeries: number[];
  categories: string[];
  totalVisitors: number;
  averagePerVisit: number;
  comparisonTotalVisitors: number;
  comparisonAveragePerVisit: number;
  peakVisit: number;
  comparisonPeakVisit: number;
}

export type ChartType = "area" | "bar";