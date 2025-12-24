import React from "react";

interface VisitorsSummaryTextProps {
  isComparisonMode: boolean;
  primaryVisitors: number;
  difference: number;
  periodLabel: string;
  comparisonLabel: string;
  attendanceMessage: string;
}

export const VisitorsSummaryText = ({
  isComparisonMode,
  primaryVisitors,
  difference,
  periodLabel,
  comparisonLabel,
  attendanceMessage,
}: VisitorsSummaryTextProps) => {
  return (
    <p className="mx-auto mt-8 w-full text-center text-sm text-gray-500 sm:text-base">
      {isComparisonMode ? (
        <>              
          We have{" "}
          {difference >= 0
            ? `${difference} more visitors than the ${comparisonLabel}. Good job!`
            : `${Math.abs(difference)} fewer visitors than the ${comparisonLabel}. Keep fighting!`}
        </>
      ) : (
        <>
          We have{" "}
          {primaryVisitors} visitors attended during {periodLabel.toLowerCase()}.
          {attendanceMessage}
        </>
      )}
    </p>
  );
};