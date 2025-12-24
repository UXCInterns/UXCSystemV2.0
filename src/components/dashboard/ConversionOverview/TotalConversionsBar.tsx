import React from 'react';

interface TotalConversionsBarProps {
  totalConversions: number;
  comparisonTotalConversions: number;
  totalCompanies: number;
  comparisonTotalCompanies: number;
  totalPercentage: string;
  isComparisonMode: boolean;
}

export const TotalConversionsBar: React.FC<TotalConversionsBarProps> = ({
  totalConversions,
  comparisonTotalConversions,
  totalCompanies,
  comparisonTotalCompanies,
  totalPercentage,
  isComparisonMode,
}) => {
  if (!isComparisonMode) {
    const percentage = parseFloat(totalPercentage);
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className="h-4 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: "#22c55e",
          }}
        />
      </div>
    );
  }

  const totalCompaniesAllPeriods = totalCompanies + comparisonTotalCompanies;
  const combinedConversions = totalConversions + comparisonTotalConversions;
  const primaryPercentage = combinedConversions > 0 ? ((totalConversions / combinedConversions) * 100) : 0;
  const comparisonPercentage = combinedConversions > 0 ? ((comparisonTotalConversions / combinedConversions) * 100) : 0;
  const totalBarWidth = totalCompaniesAllPeriods > 0 ? ((combinedConversions / totalCompaniesAllPeriods) * 100) : 0;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 relative overflow-hidden">
      <div 
        className="h-4 rounded-full flex transition-all duration-500"
        style={{ width: `${totalBarWidth}%` }}
      >
        <div
          className="h-4 transition-all duration-500"
          style={{
            width: `${primaryPercentage}%`,
            backgroundColor: "#22c55e",
            borderTopLeftRadius: '9999px',
            borderBottomLeftRadius: '9999px',
            borderTopRightRadius: comparisonPercentage > 0 ? '0' : '9999px',
            borderBottomRightRadius: comparisonPercentage > 0 ? '0' : '9999px',
          }}
        />
        {comparisonPercentage > 0 && (
          <div
            className="h-4 transition-all duration-500"
            style={{
              width: `${comparisonPercentage}%`,
              backgroundColor: "#15803d",
              borderTopRightRadius: '9999px',
              borderBottomRightRadius: '9999px',
            }}
          />
        )}
      </div>
    </div>
  );
};