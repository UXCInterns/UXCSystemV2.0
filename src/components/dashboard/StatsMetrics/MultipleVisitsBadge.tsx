// Special badge logic for multiple visits metric
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";

interface MultipleVisitsBadgeProps {
  currentCount: number;
  comparisonCount?: number;
  hasComparison: boolean;
}

export const MultipleVisitsBadge = ({
  currentCount,
  comparisonCount,
  hasComparison,
}: MultipleVisitsBadgeProps) => {
  if (!hasComparison || comparisonCount === undefined) {
    return (
      <Badge color={currentCount > 0 ? "warning" : "primary"}>
        {currentCount > 0 ? "Active" : "None"}
      </Badge>
    );
  }

  if (currentCount === comparisonCount) {
    return <Badge color="success">Same</Badge>;
  }

  if (currentCount > comparisonCount) {
    return (
      <Badge color="warning">
        <ArrowUpIcon className="w-3 h-3" />
        More
      </Badge>
    );
  }

  return (
    <Badge color="primary">
      <ArrowDownIcon className="w-3 h-3" />
      Less
    </Badge>
  );
};