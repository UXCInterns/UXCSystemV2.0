// Utilities for determining badge content in comparison mode
import { IndustryMetricsData } from "@/types/LearningJourneyDashboardTypes/industryMetrics";

export const getIndustryBadge = (data: IndustryMetricsData): string => {
  if (data.isComparison && data.comparison?.mostVisitedIndustry) {
    return data.comparison.mostVisitedIndustry;
  }
  return data.secondMostVisitedIndustry;
};

export const getSectorBadge = (data: IndustryMetricsData): string => {
  if (data.isComparison && data.comparison?.mostVisitedSector) {
    return data.comparison.mostVisitedSector;
  }
  return data.secondMostVisitedSector;
};