"use client";

import dynamic from "next/dynamic";
import React from "react";
import { useTopManpower } from "@/hooks/ManpowerHooks/useTopManpower";
import { transformManpowerToChartData } from "@/utils/ManpowerUtils/RoleDistributionChartUtils/chartDataTransformers";
import { getRoleDistributionChartOptions } from "@/config/ManpowerConfig/roleDistributionChartOptions";
import { ChartLoadingSkeleton } from "./ChartLoadingSkeleton";
import { ChartContainer } from "./ChartContainer";
import { ChartHeader } from "./ChartHeader";
import { EmptyChartState } from "./EmptyChartState";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function IndividualRoleDistributionChart() {
  const { manpower, loading } = useTopManpower(10);

  if (loading) {
    return <ChartLoadingSkeleton />;
  }

  const { categories, series } = transformManpowerToChartData(manpower);
  const options = getRoleDistributionChartOptions(categories);

  return (
    <ChartContainer>
      <ChartHeader
        title="Role Distribution by Person"
        subtitle="Top 10 people by total project involvement"
      />

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-auto pl-2">
          {manpower.length > 0 ? (
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={243}
            />
          ) : (
            <EmptyChartState message="No manpower data available" />
          )}
        </div>
      </div>
    </ChartContainer>
  );
}