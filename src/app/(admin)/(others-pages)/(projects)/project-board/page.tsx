"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";
import { ProjectMetrics } from "@/components/projects/ProjectMetrics";
import ProjectsTable from "@/components/projects/ProjectTable";

export default function ProjectBoard() {

  return (
    <>
      <PageBreadcrumb
        pageTitle="Project Board"
        items={[
          { label: "Home", href: "/" },
          { label: "Project Board" },
        ]}
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Metrics Section */}
        <div className="col-span-12">
          <ProjectMetrics />
        </div>

        <div className="col-span-12">
          <ProjectsTable />
        </div>
      </div>
    </>
  );
}