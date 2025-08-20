"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";
import ViewSession from "@/components/innopoll/viewSession/details";
import ComponentCard from "@/components/innopoll/common/ComponentCard";

export default function CreateSession() {
  return (
    <div>
      <PageBreadcrumb
        pageTitle="View Session"
        items={[
          { label: "Home", href: "/" },
          { label: "InnoPoll", href: "/innoPoll" },
          { label: "View Session" }, // last item, no href
        ]}
      />
      <div className="grid grid-cols-12 gap-6"> {/* Removed space-y-6 */}
        <ComponentCard
          className="col-span-12"
          header={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90 ml-5">
                  Session Name:
                </h3>
              </div>
            </div>
          }
        >
          <ViewSession />
        </ComponentCard>
      </div>
    </div>
  );
}


