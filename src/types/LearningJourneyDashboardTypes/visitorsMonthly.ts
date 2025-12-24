export interface MonthlyBreakdownItem {
  monthName: string;
  total: number;
}

export interface MonthlyVisitorsData {
  periodBreakdown: MonthlyBreakdownItem[];
  comparison?: {
    periodBreakdown: MonthlyBreakdownItem[];
  };
  isComparison?: boolean;
}

export interface ProcessedMonthlyData {
  primaryData: number[];
  comparisonData: number[];
  labels: string[];
}