"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useState } from "react";
import CreateSessionSidebar from "@/components/innopoll/createSession/details";
import QuestionInput from "@/components/innopoll/createSession/questions";
import { PlusIcon } from "@/icons";
import ComponentCard from "@/components/innopoll/common/ComponentCard";

export default function CreateSession() {
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Create Session"
        items={[
          { label: "Home", href: "/" },
          { label: "InnoPoll", href: "/innoPoll" },
          { label: "Create Session" }, // last item, no href
        ]}
      />
      <div className="grid grid-cols-12 gap-6"> {/* Removed space-y-6 */}
        <ComponentCard
          className="col-span-12 xl:col-span-4"
          header={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90 ml-5">
                  Create Feedback Session
                </h3>
              </div>
            </div>
          }
        >
          <CreateSessionSidebar />
        </ComponentCard>

        <ComponentCard
          className="col-span-12 xl:col-span-8"
          header={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90 ml-5">
                  Questions
                </h3>
              </div>
            </div>
          }
        >
          <QuestionInput />
        </ComponentCard>
      </div>
    </div>
  );
}


