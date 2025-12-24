"use client";

import React, { useState } from "react";
import { usePeriod } from "@/context/PeriodContext";
import { useConversionData } from "@/hooks/learningJourney/DashboardComponents/useConversionsData";
import { calculateMetrics } from "@/utils/LearningJourneyDashboardUtils/ConversionOverviewUtils/conversionsCalculations";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ConversionsCardFront } from "./ConversionsCardFront";
import { ConversionsCardBack } from "./ConversionsCardBack";

export const ConversionsOverview = () => {
  const { 
    getPeriodRange, 
    currentPeriod, 
    comparisonPeriod,
    isComparisonMode,
    getPeriodLabel 
  } = usePeriod();
  
  const [flipped, setFlipped] = useState(false);

  const { startDate, endDate } = getPeriodRange();
  const comparisonRange = getPeriodRange(comparisonPeriod);
  
  const { data, error, isLoading } = useConversionData({
    startDate,
    endDate,
    periodType: currentPeriod.type,
    isComparisonMode,
    comparisonStartDate: comparisonRange.startDate,
    comparisonEndDate: comparisonRange.endDate,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-5">
        <p className="text-red-600 dark:text-red-400">
          Failed to load metrics: {error.message}
        </p>
      </div>
    );
  }

  const metrics = calculateMetrics(data, isComparisonMode);

  return (
    <div
      className="relative w-full cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className={`w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <ConversionsCardFront
          metrics={metrics}
          isComparisonMode={isComparisonMode}
          getPeriodLabel={getPeriodLabel}
          comparisonPeriod={comparisonPeriod}
        />
        <ConversionsCardBack
          data={data!}
          metrics={metrics}
          isComparisonMode={isComparisonMode}
          getPeriodLabel={getPeriodLabel}
          comparisonPeriod={comparisonPeriod}
        />
      </div>
    </div>
  );
};