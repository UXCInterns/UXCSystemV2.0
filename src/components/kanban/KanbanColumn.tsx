"use client";
import React, { useState } from "react";

interface KanbanColumnProps {
  title: string;
  count: number;
  children?: React.ReactNode;
}

export default function KanbanColumn({ title, count, children }: KanbanColumnProps) {

  // Map title to color theme
  const getBadgeClass = () => {
    switch (title.toLowerCase()) {
      case "to do":
        return "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-300";
      case "in progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-white/[0.03] dark:text-white/80";
    }
  };

  return (
    <div className="swim-lane flex flex-col gap-5 p-4 xl:p-6 border-t border-gray-100 dark:border-gray-800">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
          {title}
          <span className={`inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium ${getBadgeClass()}`}>
            {count}
          </span>
        </h3>
      </div>
      {/* Task cards slot here */}
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
