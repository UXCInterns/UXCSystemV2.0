"use client";
import { ChatIcon } from "@/icons";
import React, { useState } from "react";

interface KanbanCardProps {
  title: string;
  description?: string;
  date: string;
  onEdit: () => void;
  onDelete: () => void;
  draggable?: boolean;
  avatars?: string[];
  commentsCount?: number;
  priority: "Low" | "Medium" | "High" | "Urgent";
}

const priorityColorMap = {
  Low: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-300",
  Medium: "bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300",
  High: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-300",
  Urgent: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-300",
};

const priorityBorderMap = {
  Low: "border-l-green-500 dark:border-l-green-300",
  Medium: "border-l-blue-500 dark:border-l-blue-300",
  High: "border-l-yellow-500 dark:border-l-yellow-300",
  Urgent: "border-l-red-500 dark:border-l-red-300",
};

export default function KanbanCard({
  title,
  description,
  date,
  onEdit,
  onDelete,
  draggable = true,
  avatars = [],
  commentsCount = 0,
  priority,
}: KanbanCardProps) {
  const [openDropDown, setOpenDropDown] = useState(false);

  return (
    <div
      draggable={draggable}
      className={`task rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/5 border-l-4 ${priorityBorderMap[priority]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Priority Tag */}
          <div className="mb-2 flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColorMap[priority]}`}>
              {priority}
            </span>

            <div className="relative">
              <button
                onClick={() => setOpenDropDown((prev) => !prev)}
                className="text-gray-700 dark:text-gray-400"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="5" cy="12" r="2" fill="currentColor" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="19" cy="12" r="2" fill="currentColor" />
                </svg>
              </button>

              {openDropDown && (
                <div
                  className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-dark"
                  onMouseLeave={() => setOpenDropDown(false)}
                >
                  <button
                    onClick={onEdit}
                    className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={onDelete}
                    className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h4 className="mb-3 text-base font-medium text-gray-900 dark:text-white/90">
            {title}
          </h4>

          {/* Date */}
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z"
              />
            </svg>
            {new Date(date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          {/* Avatar + Comments */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex -space-x-2">
              {avatars.slice(0, 3).map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt={`Avatar ${idx + 1}`}
                  className="inline-block h-6 w-6 rounded-full ring-1 ring-gray-300 dark:ring-gray-800 object-cover"
                />
              ))}
              {avatars.length > 3 && (
                <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 text-xs text-gray-800 dark:bg-gray-600 dark:text-white ring-1 ring-gray-300 dark:ring-gray-800">
                  +{avatars.length - 3}
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <ChatIcon />
              {commentsCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
