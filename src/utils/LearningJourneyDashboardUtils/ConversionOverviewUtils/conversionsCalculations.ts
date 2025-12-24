import { ConversionData, ConversionMetrics } from '@/types/LearningJourneyDashboardTypes/conversionsOverview';

export const calculateMetrics = (
  data: ConversionData | undefined,
  isComparisonMode: boolean
): ConversionMetrics => {
  const trainingCompanies = data?.training || [];
  const consultancyCompanies = data?.consultancy || [];
  const totalCompanies = data?.totalCompanies || 0;

  const trainingCount = trainingCompanies.length;
  const consultancyCount = consultancyCompanies.length;
  const totalConversions = trainingCount + consultancyCount;

  const comparisonTrainingCount = data?.comparison?.training?.length || 0;
  const comparisonConsultancyCount = data?.comparison?.consultancy?.length || 0;
  const comparisonTotalCompanies = data?.comparison?.totalCompanies || 0;
  const comparisonTotalConversions = comparisonTrainingCount + comparisonConsultancyCount;

  let totalPercentage = "0";
  if (isComparisonMode) {
    const totalConversionsAllPeriods = totalConversions + comparisonTotalConversions;
    const totalCompaniesAllPeriods = totalCompanies + comparisonTotalCompanies;
    totalPercentage = totalCompaniesAllPeriods > 0 
      ? ((totalConversionsAllPeriods / totalCompaniesAllPeriods) * 100).toFixed(1)
      : "0";
  } else {
    totalPercentage = totalCompanies > 0 
      ? ((totalConversions / totalCompanies) * 100).toFixed(1)
      : "0";
  }

  const trainingChange = isComparisonMode && comparisonTrainingCount > 0
    ? (((trainingCount - comparisonTrainingCount) / comparisonTrainingCount) * 100).toFixed(1)
    : null;
  
  const consultancyChange = isComparisonMode && comparisonConsultancyCount > 0
    ? (((consultancyCount - comparisonConsultancyCount) / comparisonConsultancyCount) * 100).toFixed(1)
    : null;

  const totalConversionsChange = isComparisonMode && comparisonTotalConversions > 0
    ? (((totalConversions - comparisonTotalConversions) / comparisonTotalConversions) * 100).toFixed(1)
    : null;

  return {
    trainingCount,
    consultancyCount,
    totalConversions,
    comparisonTrainingCount,
    comparisonConsultancyCount,
    comparisonTotalConversions,
    totalCompanies,
    comparisonTotalCompanies,
    totalPercentage,
    trainingChange,
    consultancyChange,
    totalConversionsChange,
  };
};

export const calculatePercentage = (
  value: number,
  total: number,
  decimals: number = 1
): string => {
  return total > 0 ? ((value / total) * 100).toFixed(decimals) : "0";
};