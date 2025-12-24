// Loading state component for Industry Metrics section
import React from "react";
import { GroupIcon, BoltIcon } from "@/icons";
import { IndustryMetricCard } from "./IndustryMetricCard";

export const IndustryMetricsLoadingState = () => {
  return (
    <div className="flex flex-col gap-6">
      <IndustryMetricCard
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
        titleTop="Most Visited"
        titleBottom="Industry"
        value="Loading..."
        loading={true}
      />
      <IndustryMetricCard
        icon={<BoltIcon className="text-gray-800 size-6 dark:text-white/90" />}
        titleTop="Most Visited"
        titleBottom="Sector"
        value="Loading..."
        loading={true}
      />
    </div>
  );
};