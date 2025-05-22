import type { Metadata } from "next";
import CETMetrics from "@/components/cettraining/CETMetrics";
import React from "react";
import MonthlyTarget from "@/components/cettraining/MonthlyTarget";
import StatisticsChart from "@/components/cettraining/StatisticsChart";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function CETTraining() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 xl:col-span-6">
            <MonthlyTarget />
        </div>
        <div className="col-span-12 space-y-6 xl:col-span-6">
            <CETMetrics />
        </div>

        <div className="col-span-12">
            <StatisticsChart />
        </div>
      </div>
    </>
  );
}
