"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/kanban/common/ComponentCard";
import ProjectCard from "@/components/kanban/ProjectCard";
import { useProjectData } from "@/hooks/useProjectData";
import React from "react";


export default function Kanban() {
  const { data: projects } = useProjectData();

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
          {projects.map((project) => (
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
