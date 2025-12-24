import React from 'react';

interface StackedProgressBarProps {
  primaryValue: number;
  comparisonValue: number;
  totalMax: number;
  primaryColor: string;
  comparisonColor: string;
  isComparisonMode: boolean;
}

export const StackedProgressBar: React.FC<StackedProgressBarProps> = ({
  primaryValue,
  comparisonValue,
  totalMax,
  primaryColor,
  comparisonColor,
  isComparisonMode,
}) => {
  if (!isComparisonMode) {
    const percentage = totalMax > 0 ? ((primaryValue / totalMax) * 100) : 0;
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: primaryColor,
          }}
        />
      </div>
    );
  }

  const total = primaryValue + comparisonValue;
  const primaryPercentage = total > 0 ? ((primaryValue / total) * 100) : 0;
  const comparisonPercentage = total > 0 ? ((comparisonValue / total) * 100) : 0;
  const totalBarWidth = totalMax > 0 ? ((total / totalMax) * 100) : 0;

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
      <div 
        className="h-3 rounded-full flex transition-all duration-500"
        style={{ width: `${totalBarWidth}%` }}
      >
        <div
          className="h-3 transition-all duration-500"
          style={{
            width: `${primaryPercentage}%`,
            backgroundColor: primaryColor,
            borderTopLeftRadius: '9999px',
            borderBottomLeftRadius: '9999px',
            borderTopRightRadius: comparisonPercentage > 0 ? '0' : '9999px',
            borderBottomRightRadius: comparisonPercentage > 0 ? '0' : '9999px',
          }}
        />
        {comparisonPercentage > 0 && (
          <div
            className="h-3 transition-all duration-500"
            style={{
              width: `${comparisonPercentage}%`,
              backgroundColor: comparisonColor,
              borderTopRightRadius: '9999px',
              borderBottomRightRadius: '9999px',
            }}
          />
        )}
      </div>
    </div>
  );
};