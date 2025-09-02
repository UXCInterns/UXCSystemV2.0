import React from "react";
import type { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PeriodProvider } from "@/context/PeriodContext";

import { StatsMetrics } from "@/components/dashboard/StatsMetrics";
import { ConversionsOverview } from "@/components/dashboard/ConversionOverview";
import { IndustryMetrics } from "@/components/dashboard/IndustryMetrics";
import VisitorsAttended from "@/components/dashboard/VisitorsAttended";
import VisitorsByMonth from "@/components/dashboard/VisitorsByMonth";
import VisitorsByDate from "@/components/dashboard/VisitorsByDate";
import VisitsComparison from "@/components/dashboard/VisitsComparison";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

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
