"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ManpowerMetrics } from "@/components/manpower/ManpowerMetrics";
import MapowerTable from "@/components/manpower/MapowerTable";
import IndividualRoleDistributionChart from "@/components/manpower/IndividualRoleDistributionChart";
import StatusDistributionChart from "@/components/manpower/StatusDistributionChart";

export default function Manpower() {
  return (
    <>
      <PageBreadcrumb
        pageTitle="Manpower"
        items={[
          { label: "Home", href: "/" },
          { label: "Manpower" },
        ]}
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Metrics Section */}
        <div className="col-span-12">
          <ManpowerMetrics />
        </div>

        <div className="col-span-5">
          <StatusDistributionChart />
        </div>

        <div className="col-span-7">
          <IndividualRoleDistributionChart />
        </div>

        <div className="col-span-12">
          <MapowerTable />
        </div>
      </div>
    </>
  );
}
