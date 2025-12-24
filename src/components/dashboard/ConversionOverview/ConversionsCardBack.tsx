import React from 'react';
import { ConversionData, ConversionMetrics } from '@/types/LearningJourneyDashboardTypes/conversionsOverview';

interface ConversionsCardBackProps {
  data: ConversionData;
  metrics: ConversionMetrics;
  isComparisonMode: boolean;
  getPeriodLabel: (period?: any) => string;
  comparisonPeriod?: any;
}

export const ConversionsCardBack: React.FC<ConversionsCardBackProps> = ({
  data,
  metrics,
  isComparisonMode,
  getPeriodLabel,
  comparisonPeriod,
}) => {
  const trainingCompanies = data?.training || [];
  const consultancyCompanies = data?.consultancy || [];

  return (
    <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto custom-scrollbar">
      <h4 className="text-lg font-semibold mb-4">
        Companies - {getPeriodLabel()}
        {isComparisonMode && comparisonPeriod && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            vs {getPeriodLabel(comparisonPeriod)}
          </span>
        )}
      </h4>
      
      <div className="flex gap-6">
        {/* Training Column */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h5 className="font-medium text-blue-600 dark:text-blue-400">
              Training ({metrics.trainingCount})
            </h5>
            {isComparisonMode && (
              <span className="text-xs text-gray-500">
                (was {metrics.comparisonTrainingCount})
              </span>
            )}
          </div>
          <ul className="space-y-2 text-sm text-gray-400">
            {trainingCompanies.length ? (
              trainingCompanies.map((name: string, i: number) => (
                <li key={i} className="border-b border-gray-100 dark:border-gray-800 pb-1">
                  {name}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No training companies in this period</li>
            )}
          </ul>
        </div>

        {/* Consultancy Column */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h5 className="font-medium text-green-600 dark:text-green-400">
              Consultancy ({metrics.consultancyCount})
              {isComparisonMode && (
                <span className="text-xs text-gray-500 ml-2">
                  (was {metrics.comparisonConsultancyCount})
                </span>
              )}
            </h5>
          </div>
          <ul className="space-y-2 text-sm text-gray-400">
            {consultancyCompanies.length ? (
              consultancyCompanies.map((name: string, i: number) => (
                <li key={i} className="border-b border-gray-100 dark:border-gray-800 pb-1">
                  {name}
                </li>
              ))
            ) : (
              <li className="text-gray-500">No consultancy companies in this period</li>
            )}
          </ul>
        </div>
      </div>

      {/* Comparison Summary */}
      {isComparisonMode && data?.comparison && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
            Period Comparison Summary
          </h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-gray-500 dark:text-gray-400">Primary Period:</p>
              <p className="font-medium">Training: {metrics.trainingCount}</p>
              <p className="font-medium">Consultancy: {metrics.consultancyCount}</p>
              <p className="font-semibold">Total: {metrics.totalConversions}</p>
              <p className="font-medium">Companies: {metrics.totalCompanies}</p>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 dark:text-gray-400">Comparison Period:</p>
              <p className="font-medium">Training: {metrics.comparisonTrainingCount}</p>
              <p className="font-medium">Consultancy: {metrics.comparisonConsultancyCount}</p>
              <p className="font-semibold">Total: {metrics.comparisonTotalConversions}</p>
              <p className="font-medium">Companies: {metrics.comparisonTotalCompanies}</p>
            </div>
          </div>
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Combined Conversion Rate: {metrics.totalPercentage}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ({metrics.totalConversions + metrics.comparisonTotalConversions} conversions / {metrics.totalCompanies + metrics.comparisonTotalCompanies} total companies)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};