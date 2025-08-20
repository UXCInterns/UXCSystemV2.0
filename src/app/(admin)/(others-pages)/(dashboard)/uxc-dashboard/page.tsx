import type { Metadata } from "next";
import { UXCMetrics } from "@/components/dashboard/UXCMetrics";
import React from "react";
import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ConversionsOverview } from "@/components/dashboard/ConversionOverview";
import { IndustryMetrics } from "@/components/dashboard/IndustryMetrics";
import ComparisonMetrics from "@/components/dashboard/ComparisonMetrics";

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

        <div className="col-span-12 space-y-6 xl:col-span-12">
          <UXCMetrics />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>
        
        <div className="col-span-12 space-y-6 xl:col-span-5">
          <ConversionsOverview />
        </div>

        <div className="col-span-12 xl:col-span-2">
          <IndustryMetrics />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <ComparisonMetrics />
        </div>

        <div className="col-span-12 space-y-6">
          {/* <MonthlySalesChart /> */}
          <StatisticsChart />
        </div>
      </div>
    </>
  );
}
