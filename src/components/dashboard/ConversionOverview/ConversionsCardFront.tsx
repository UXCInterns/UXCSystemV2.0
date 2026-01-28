import React from 'react';
import { TrendingUp, GraduationCap, BriefcaseIcon } from 'lucide-react';
import { ChangeIndicator } from './ChangeIndicator';
import { StackedProgressBar } from './StackedProgressBar';
import { TotalConversionsBar } from './TotalConversionsBar';
import { ConversionMetrics, DataBar } from '@/types/LearningJourneyDashboardTypes/conversionsOverview';

type Period = {
  year?: number;
  month?: number;
  quarter?: number;
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
};

interface ConversionsCardFrontProps {
  metrics: ConversionMetrics;
  isComparisonMode: boolean;
  getPeriodLabel: (period?: Period) => string;
  comparisonPeriod?: Period;
}

export const ConversionsCardFront: React.FC<ConversionsCardFrontProps> = ({
  metrics,
  isComparisonMode,
  getPeriodLabel,
  comparisonPeriod,
}) => {
  const dataBars: DataBar[] = [
    {
      name: "Training",
      value: metrics.trainingCount,
      comparisonValue: metrics.comparisonTrainingCount,
      color: "#465FFF",
      comparisonColor: "#3730a3",
      icon: <GraduationCap className="text-gray-700 w-6 h-6 dark:text-white/90" />,
      change: metrics.trainingChange,
    },
    {
      name: "Consultancy",
      value: metrics.consultancyCount,
      comparisonValue: metrics.comparisonConsultancyCount,
      color: "#10b981",
      comparisonColor: "#047857",
      icon: <BriefcaseIcon className="text-gray-700 w-6 h-6 dark:text-white/90" />,
      change: metrics.consultancyChange,
    },
  ];

  const maxConversions = Math.max(
    metrics.totalConversions,
    isComparisonMode ? metrics.comparisonTotalConversions : 0,
    Math.max(...dataBars.map(item => Math.max(item.value, item.comparisonValue)))
  );

  return (
    <div className="inset-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] w-full mx-auto [backface-visibility:hidden]">
      <div className="flex flex-col mb-3">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-100">
          Conversions Overview
        </h4>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          {getPeriodLabel()}
          {isComparisonMode && comparisonPeriod && (
            <span className="ml-2 text-blue-500">
              vs {getPeriodLabel(comparisonPeriod)}
            </span>
          )}
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-2 p-4 bg-gray-100 dark:bg-white/3 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-900">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              Total Conversions
              {isComparisonMode && (
                <span className="ml-1 text-xs">
                  (Combined Rate)
                </span>
              )}
            </span>
            <div className="flex items-center">
              <span className="text-3xl font-extrabold text-gray-800 dark:text-white">
                {isComparisonMode 
                  ? metrics.totalConversions + metrics.comparisonTotalConversions 
                  : metrics.totalConversions}
              </span>
              <ChangeIndicator change={metrics.totalConversionsChange} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <TotalConversionsBar
            totalConversions={metrics.totalConversions}
            comparisonTotalConversions={metrics.comparisonTotalConversions}
            totalCompanies={metrics.totalCompanies}
            comparisonTotalCompanies={metrics.comparisonTotalCompanies}
            totalPercentage={metrics.totalPercentage}
            isComparisonMode={isComparisonMode}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
            {metrics.totalPercentage}%
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {dataBars.map((item) => {
          const primaryPercentage = isComparisonMode && maxConversions > 0 
            ? ((item.value / maxConversions) * 100).toFixed(1)
            : metrics.totalConversions > 0 
              ? ((item.value / metrics.totalConversions) * 100).toFixed(1) 
              : "0";

          return (
            <div key={item.name} className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                {item.icon}
              </div>
              <div className="flex flex-col w-24">
                <span className="text-md font-medium text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                    {item.value}
                    {isComparisonMode && (
                      <span className="text-xs ml-1">
                        (vs {item.comparisonValue})
                      </span>
                    )}
                  </span>
                  <ChangeIndicator change={item.change} />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <StackedProgressBar
                    primaryValue={item.value}
                    comparisonValue={item.comparisonValue}
                    totalMax={maxConversions}
                    primaryColor={item.color}
                    comparisonColor={item.comparisonColor}
                    isComparisonMode={isComparisonMode}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                    {primaryPercentage}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};