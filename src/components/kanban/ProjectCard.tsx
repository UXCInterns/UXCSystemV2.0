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

const statusBorderMap: Record<string, string> = {
  completed: "border-l-green-500 dark:border-l-green-300",
  "in progress": "border-l-blue-500 dark:border-l-blue-300",
  pending: "border-l-orange-500 dark:border-l-orange-300",
  aborted: "border-l-gray-500 dark:border-l-gray-300", // fixed typo
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
    endDate,
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
  const borderClasses = statusBorderMap[statusKey] || "border-l-gray-300";

  return (
    <div
      onClick={handleClick}
      className={`task rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5 border-l-4 ${borderClasses} cursor-pointer`}
    >
      {/* Status */}
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClasses}`}>
        {status}
      </span>

      {/* Project Name */}
      <h4 className="mt-4 text-base font-medium text-gray-900 dark:text-white/90">
        {projectName}
      </h4>

      {/* End Date */}
      <div className="mt-3 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <svg
          className="fill-current"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z"
          />
        </svg>
        {new Date(endDate).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>

      {/* Avatars */}
      <div className="mt-5 flex flex-wrap gap-2 -space-x-4">
        {allAvatars.slice(0, 5).map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Avatar ${idx + 1}`}
            className="h-6 w-6 rounded-full ring-1 ring-white dark:ring-gray-800 object-cover"
          />
        ))}
        {allAvatars.length > 5 && (
          <div className="h-6 w-6 rounded-full bg-gray-300 text-xs text-gray-800 dark:bg-gray-600 dark:text-white flex items-center justify-center ring-1 ring-white dark:ring-gray-800">
            +{allAvatars.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}
