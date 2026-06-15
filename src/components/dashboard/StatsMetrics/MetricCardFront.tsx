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
  title,
  value,
  comparisonValue,
}: MetricCardFrontProps) => {
  const renderTitle = () => {
    if (title === "Visited Multiple Times") {
      return "Companies Visited Multiple Times";
    }

    return `${title} Visited`;
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
    <div className="inset-0 rounded-2xl border border-gray-200 bg-white p-3 md:p-4 dark:border-gray-800 dark:bg-white/[0.03] [backface-visibility:hidden]">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {value}
        </h2>

        <div className="text-base font-medium text-gray-700 dark:text-gray-300">
          {renderTitle()}
        </div>

        <div className="flex items-center gap-2">
          {comparisonValue && (
            <span className="text-sm text-blue-600 dark:text-blue-400">
              vs {comparisonValue}
            </span>
          )}

          {renderPercentageBadge()}
        </div>
      </div>
    </div>
  );
};