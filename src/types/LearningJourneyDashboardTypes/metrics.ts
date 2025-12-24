//Type definitions for metrics and dashboard data
export interface MetricsData {
  companies: string[];
  totalCompanies: number;
  uniqueCompanies: string[];
  multipleVisits: string[];
  isComparison?: boolean;
  comparison?: ComparisonData;
  comparisonMetrics?: ComparisonMetrics;
}

export interface ComparisonData {
  totalCompanies: number;
  uniqueCompanies: string[];
  multipleVisits: string[];
}

export interface ComparisonMetrics {
  totalCompaniesChange: string;
  uniqueCompaniesChange: string;
}

export type BadgeColor = "primary" | "success" | "error" | "warning";