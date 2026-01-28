// Front side of metric card showing value and badge
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { calculatePercentageChange } from "@/utils/LearningJourneyDashboardUtils/StatsMetricsUtils/badgeHelpers";

interface MetricCardFrontProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  badge: React.ReactNode;
  comparisonValue?: string;
}

export const MetricCardFront = ({
  icon,
  title,
  value,
  comparisonValue,
}: MetricCardFrontProps) => {
  const renderTitle = () => {
    if (title === "Visited Multiple Times") {
      return (
        <>
          <span className="text-base font-medium text-gray-700 dark:text-gray-300">
            Companies Visited
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Multiple Times
          </span>
        </>
      );
    }
    
    return (
      <>
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">
          {title}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Visited
        </span>
      </>
    );
  };

  const renderPercentageBadge = () => {
    if (!comparisonValue) return null;

    const v = Number(value);
    const c = Number(comparisonValue);
    
    if (isNaN(v) || isNaN(c) || c === 0) return null;

    const change = calculatePercentageChange(v, c);
    if (!change) return null;

    const positive = Number(change) >= 0;

    return (
      <Badge variant="light" size="sm" color={positive ? "success" : "error"}>
        {positive ? "+" : ""}
        {change}%
      </Badge>
    );
  };

  return (
    <div className="inset-0 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 [backface-visibility:hidden]">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {icon}
        </div>
        <div className="flex flex-col leading-tight">
          {renderTitle()}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              {value}
            </h4>
            {comparisonValue && (
              <span className="text-sm text-blue-600 dark:text-blue-400">
                vs {comparisonValue}
              </span>
            )}
          </div>
          {renderPercentageBadge()}
        </div>
      </div>
    </div>
  );
};