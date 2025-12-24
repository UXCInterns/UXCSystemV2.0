export interface ConversionData {
  training: string[];
  consultancy: string[];
  totalCompanies: number;
  uniqueCompanies: string[];
  comparison?: {
    training: string[];
    consultancy: string[];
    totalCompanies: number;
    uniqueCompanies: string[];
  };
}

export interface DataBar {
  name: string;
  value: number;
  comparisonValue: number;
  color: string;
  comparisonColor: string;
  icon: React.ReactNode;
  change: string | null;
}

export interface ConversionMetrics {
  trainingCount: number;
  consultancyCount: number;
  totalConversions: number;
  comparisonTrainingCount: number;
  comparisonConsultancyCount: number;
  comparisonTotalConversions: number;
  totalCompanies: number;
  comparisonTotalCompanies: number;
  totalPercentage: string;
  trainingChange: string | null;
  consultancyChange: string | null;
  totalConversionsChange: string | null;
}