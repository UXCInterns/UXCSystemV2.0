"use client";

import React, { use } from "react";
import KanbanHeader from "@/components/kanban/KanbanHeader";
import ProjectKanbanBoard from "@/components/kanban/ProjectKanbanBoard";
import { useConnectionCleaner } from "@/hooks/useConnectionCleaner";
import dynamic from 'next/dynamic';

const GanttChart = dynamic(
  () => import('@/components/kanban/GanttChart'),
  { ssr: false }
);

export default function KanbanPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise
  const { id } = use(params);
  
  // Clean up any stuck connections when leaving the page
  useConnectionCleaner();

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Header Section - fetches and displays project details */}
      <div className="col-span-12">
        <KanbanHeader projectId={id} />
      </div>

      {/* Kanban Board Section - fetches and displays tasks */}
      <div className="col-span-12">
        <ProjectKanbanBoard projectId={id} />
      </div>

      {/* Gantt Chart Section - shares tasks from Kanban */}
      <div className="col-span-12">
        <GanttChart projectId={id} />
      </div>
    </div>
  );
}