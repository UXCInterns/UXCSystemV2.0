// Factory function to create metric badges based on change values
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";
import { getBadgeColor, getBadgeIconType, formatChange } from "@/utils/LearningJourneyDashboardUtils/StatsMetricsUtils/badgeHelpers";

export const createMetricBadge = (
  changeValue: string | undefined, 
  hasComparison: boolean,
  fallbackText: string = "--"
): React.ReactNode => {
  if (!changeValue || !hasComparison) {
    return <Badge color="primary">{fallbackText}</Badge>;
  }

  const iconType = getBadgeIconType(changeValue);
  const icon = iconType === "up" ? (
    <ArrowUpIcon className="w-3 h-3" />
  ) : iconType === "down" ? (
    <ArrowDownIcon className="w-3 h-3" />
  ) : null;

  return (
    <Badge color={getBadgeColor(changeValue)}>
      {icon}
      {formatChange(changeValue)}
    </Badge>
  );
};
