// Header component for UXC Metrics with period selector
import React from "react";
import PeriodSelector from "@/components/period/PeriodContext";
import { usePeriod } from "@/context/PeriodContext";

interface MetricsHeaderProps {
  hasComparison: boolean;
}

export const MetricsHeader = ({ hasComparison }: MetricsHeaderProps) => {
  const { getPeriodLabel, currentPeriod, comparisonPeriod } = usePeriod();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          UXC Metrics
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getPeriodLabel(currentPeriod)}
          {hasComparison && (
            <>
              {" vs "}
              <span className="text-blue-600 dark:text-blue-400">
                {getPeriodLabel(comparisonPeriod)}
              </span>
            </>
          )}
          {" Overview"}
        </p>
      </div>
      <PeriodSelector />
    </div>
  );
};