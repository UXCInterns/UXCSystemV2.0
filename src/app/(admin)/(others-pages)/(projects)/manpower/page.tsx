"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PlusIcon } from "@/icons";
import ManpowerTable from "@/components/projects/manpower/mapowerTable";
import { ManpowerMetrics } from "@/components/projects/manpower/manpowerMetrics";
import IndividualChart from "../../../../../components/projects/manpower/IndividualChart";
import AvailabilityChartMetric from "@/components/projects/manpower/availabilityChartMetric";

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Manpower" />

      {/* Main content area */}
      <div className="space-y-6 mt-6">
        {/* Responsive row layout for metrics and chart */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column (1/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ManpowerMetrics />
          <AvailabilityChartMetric />
        </div>

        {/* Right Column (2/3 width) */}
        <div className="lg:col-span-3">
          <ManpowerTable />
        </div>
      </div>
        <IndividualChart />
      </div>
    </div>
  );
}
