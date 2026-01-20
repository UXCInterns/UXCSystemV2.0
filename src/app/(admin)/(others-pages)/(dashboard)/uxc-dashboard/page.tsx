import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PeriodProvider } from "@/context/PeriodContext";

import { StatsMetrics } from "@/components/dashboard/StatsMetrics/StatsMetrics";
import { ConversionsOverview } from "@/components/dashboard/ConversionOverview/ConversionOverview";
import { IndustryMetrics } from "@/components/dashboard/IndustryMetrics/IndustryMetrics";
import VisitorsAttended from "@/components/dashboard/VisitorsAttended/VisitorsAttended";
import VisitorsByMonth from "@/components/dashboard/VisitorsByMonth/VisitorsByMonth";
import VisitorsByDate from "@/components/dashboard/VisitorsByDate/VisitorsByDate";
import VisitsComparison from "@/components/dashboard/VisitsComparison";

export default function UXCDashboard() {
  return (
    <>
      <PageBreadcrumb
        pageTitle="UXC Learning Journey"
        items={[
          { label: "Home", href: "/" },
          { label: "UXC Learning Journey" },
        ]}
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <PeriodProvider>
          <div className="col-span-12 space-y-6 xl:col-span-12">
            <StatsMetrics />
          </div>

          <div className="col-span-12 xl:col-span-5">
            <VisitorsAttended />
          </div>
          
          <div className="col-span-12 space-y-6 xl:col-span-4">
            <ConversionsOverview />
          </div>

          <div className="col-span-12 xl:col-span-3">
            <IndustryMetrics />
          </div>

          <div className="col-span-12 xl:col-span-6">
            <VisitorsByMonth />
          </div>

          <div className="col-span-12 xl:col-span-6">
            <VisitsComparison />
          </div>

          <div className="col-span-12 space-y-6">
            <VisitorsByDate />
          </div>
        </PeriodProvider>
      </div>
    </>
  );
}
