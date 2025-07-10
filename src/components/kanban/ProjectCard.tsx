"use client";
import React from "react";
import { useRouter } from "next/navigation";

type Priority = "Low" | "Medium" | "High" | "Urgent";

interface ProjectCardProps {
  id: number;
  projectName: string;
  projectManager: { image: string; name: string };
  projectLead: { image: string; name: string };
  coreTeam: { images: string[] };
  supportTeam: { images: string[] };
  startDate: string;
  endDate: string;
  priority: Priority;
  status: string;
}

const priorityColorMap = {
  Low: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-300",
  Medium: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300",
  High: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-300",
  Urgent: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-300",
};

const statusColorMap: Record<string, string> = {
  aborted: "bg-gray-200 text-gray-700 dark:bg-gray-600/20 dark:text-gray-300",
  completed: "bg-green-200 text-green-800 dark:bg-green-600/20 dark:text-green-300",
  "in progress": "bg-blue-200 text-blue-800 dark:bg-blue-600/20 dark:text-blue-300",
  pending: "bg-orange-200 text-orange-800 dark:bg-orange-600/20 dark:text-orange-300",
};

export default function ProjectCard(props: ProjectCardProps) {
  const router = useRouter();
  const {
    id,
    projectName,
    projectManager,
    projectLead,
    coreTeam,
    supportTeam,
    startDate,
    endDate,
    priority,
    status,
  } = props;

  const handleClick = () => router.push(`/shared-board/${id}`);

  const allAvatars = [
    projectManager.image,
    projectLead.image,
    ...coreTeam.images,
    ...supportTeam.images,
  ];

  const statusKey = status.toLowerCase();
  const statusClasses = statusColorMap[statusKey] || "bg-gray-200 text-gray-700";

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/5"
    >
      {/* Status Badge */}
      <div className="mb-2">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClasses}`}>
          {status}
        </span>
      </div>

      {/* Title and Priority */}
      <div className="mb-4 flex flex-col items-start justify-between">
        <h3 className="text-[22px] font-medium text-gray-900 dark:text-white">{projectName}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Due Date: {new Date(endDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Bottom: Avatars and Due Date */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex -space-x-2">
          {allAvatars.slice(0, 5).map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Avatar ${idx + 1}`}
              className="h-7 w-7 rounded-full ring-1 ring-white dark:ring-gray-800 object-cover"
            />
          ))}
          {allAvatars.length > 5 && (
            <div className="h-7 w-7 rounded-full bg-gray-300 text-xs text-gray-800 dark:bg-gray-600 dark:text-white flex items-center justify-center ring-1 ring-white dark:ring-gray-800">
              +{allAvatars.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
