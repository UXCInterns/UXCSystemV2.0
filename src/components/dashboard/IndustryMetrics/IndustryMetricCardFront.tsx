// Front side of industry metric card showing metric value and badge
import React from "react";
import Badge from "@/components/ui/badge/Badge";

interface IndustryMetricCardFrontProps {
  icon: React.ReactNode;
  titleTop: string;
  titleBottom: string;
  value: string;
  badgeText?: string;
  comparisonValue?: string;
}

export const IndustryMetricCardFront = ({
  icon,
  titleTop,
  titleBottom,
  value,
  badgeText,
  comparisonValue,
}: IndustryMetricCardFrontProps) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 [backface-visibility:hidden]">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {icon}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {titleTop}
          </span>
          <span className="text-base text-gray-800 dark:text-white/90">
            {titleBottom}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <h2 className="font-bold text-gray-800 text-xl dark:text-white/90">
          {value}
        </h2>
        {comparisonValue && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            vs
          </span>
        )}
      </div>

      {badgeText && (
        <div className="mt-0">
          <Badge color={comparisonValue ? "warning" : "primary"}>
            <span className="text-xs">
              {comparisonValue || badgeText}
            </span>
          </Badge>
        </div>
      )}
    </div>
  );
};