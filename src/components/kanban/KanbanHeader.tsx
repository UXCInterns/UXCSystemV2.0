"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useProjectData } from "@/hooks/KanbanBoardHooks/KanbanHeader/useProjectData";
import { useProjectRealtime } from "@/hooks/KanbanBoardHooks/KanbanHeader/useProjectRealtime";
import { getAllTeamMembers, formatDate } from "@/utils/KanbanHeaderViewUtils/kanbanHeaderUtils";
import { ProjectTitleSection } from "./KanbanHeaderView/ProjectTitleSection";
import { DueDateSection } from "./KanbanHeaderView/DueDateSection";
import { ProgressSection } from "./KanbanHeaderView/ProgressSection";
import { TeamMembersSection } from "./KanbanHeaderView/TeamMembersSection";
import { KanbanHeaderLoading } from "./KanbanHeaderView/KanbanHeaderLoading";
import { KanbanHeaderError } from "./KanbanHeaderView/KanbanHeaderError";

interface KanbanHeaderProps {
  projectId: string;
}

export default function KanbanHeader({ projectId }: KanbanHeaderProps) {
  const router = useRouter();
  const { project, loading, error } = useProjectData(projectId);
  const { realtimeChannel, liveProgress, liveStatus } = useProjectRealtime(projectId);

  if (loading) {
    return <KanbanHeaderLoading />;
  }

  if (error || !project) {
    return <KanbanHeaderError error={error || 'Project not found'} />;
  }

  const displayProgress = liveProgress !== null ? liveProgress : project.progress;
  const allTeamMembers = getAllTeamMembers(project);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hidden md:flex items-center justify-between">
      <ProjectTitleSection
        projectName={project.project_name}
        onBack={() => router.push("/project-board")}
      />

      <DueDateSection dueDate={formatDate(project.end_date)} />

      <ProgressSection
        progress={displayProgress}
        isLive={realtimeChannel?.state === 'joined'}
      />

      <TeamMembersSection teamMembers={allTeamMembers} />
    </div>
  );
}