"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { ManpowerMetrics } from "@/components/manpower/ManpowerMetrics";

export default function ECommerce() {
  return (
    <>
      <PageBreadcrumb
        pageTitle="E-Commerce"
        items={[
          { label: "Home", href: "/" },
          { label: "E-Commerce" },
        ]}
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Metrics Section */}
        <div className="col-span-12">
          <ManpowerMetrics />
        </div>

        <div className="col-span-5">

        </div>

        <div className="col-span-7">

        </div>

        <div className="col-span-12">

        </div>
      </div>
    </>
  );
}
