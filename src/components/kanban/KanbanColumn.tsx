"use client";

import { PageIcon, PlusIcon } from "@/icons";
import React from "react";

interface KanbanColumnProps {
  title: string;
  count: number;
  children?: React.ReactNode;
  onAddClick: (status: string) => void;
}

export default function KanbanColumn({
  title,
  count,
  children,
  onAddClick,
}: KanbanColumnProps) {
  const getBadgeClass = () => {
    switch (title.toLowerCase()) {
      case "to do":
        return "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-300";
      case "in progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-300";
      case "review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-white/[0.03] dark:text-white/80";
    }
  };

  const isEmpty = !children || (Array.isArray(children) && children.length === 0);

  return (
    <div className="swim-lane flex flex-col gap-5 p-2 border-t border-gray-100 dark:border-gray-800">
      <div className="flex flex-col gap-3 border bg-white dark:bg-white/[0.03] p-3 rounded-lg dark:border-gray-800">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
            {title}
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium ${getBadgeClass()}`}
            >
              {count}
            </span>
          </h3>
          <button
            onClick={() => onAddClick(title.toLowerCase())}
            className="flex items-center gap-2 border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03] bg-white p-2 rounded-lg"
          >
            <PlusIcon className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" />
          </button>
        </div>

        <div className="flex flex-col gap-4 min-h-[80px]">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-4 text-gray-400">
              <PageIcon className="mb-2" /> {/* Icon above the message */}
              <p className="text-sm text-center">
                No tasks currently. Board is empty.
              </p>
            </div>
          ) : (
            children
          )}
        </div>

        <div className="bg-white border border-gray-200 dark:bg-white/[0.03] dark:border-gray-800 p-3 rounded-lg flex flex-col items-center" onClick={() => onAddClick(title.toLowerCase())}>
          <button
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            + Add new item
          </button>
        </div>
      </div>
    </div>
  );
}
