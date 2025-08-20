"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/kanban/common/ComponentCard";
import ProjectCard from "@/components/kanban/ProjectCard";
import { initialData } from "@/components/projects/projectboard/currentProjects";
import React, { useState } from "react";


export default function Kanban() {
  return (
    <div>
      <PageBreadcrumb
        pageTitle="Kanban"
        items={[
          { label: "Home", href: "/" },
          { label: "Kanban"},
          
        ]}
      />

      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialData.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              priority={project.priority as "Low" | "Medium" | "High" | "Urgent"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
