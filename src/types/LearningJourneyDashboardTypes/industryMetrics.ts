// Type definitions for industry and sector metrics data
export interface IndustryMetricsData {
  mostVisitedIndustry: string;
  secondMostVisitedIndustry: string;
  mostVisitedSector: string;
  secondMostVisitedSector: string;
  industryCompanies: string[];
  sectorCompanies: string[];
  allIndustries: Array<[string, { count: number; companies: string[] }]>;
  allSectors: Array<[string, { count: number; companies: string[] }]>;
  comparison?: IndustryComparisonData;
  isComparison?: boolean;
}

export interface IndustryComparisonData {
  mostVisitedIndustry: string;
  secondMostVisitedIndustry: string;
  mostVisitedSector: string;
  secondMostVisitedSector: string;
  industryCompanies: string[];
  sectorCompanies: string[];
  allIndustries: Array<[string, { count: number; companies: string[] }]>;
  allSectors: Array<[string, { count: number; companies: string[] }]>;
}