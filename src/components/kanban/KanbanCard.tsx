"use client";
import React, { useState } from "react";

interface KanbanCardProps {
  title: string;
  description?: string;
  date: string;
  onEdit: () => void;
  onDelete: () => void;
  draggable?: boolean;
}

export default function KanbanCard({
  title,
  description,
  date,
  onEdit,
  onDelete,
  draggable = true,
}: KanbanCardProps) {
    const [openDropDown, setOpenDropDown] = useState(false);
  return (
    <div
      draggable={draggable}
      className="task rounded-xl border border-gray-200 bg-white p-5 shadow-theme-sm dark:border-gray-800 dark:bg-white/5"
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h4 className="mb-1 text-base font-medium text-gray-900 dark:text-white/90">
            {title}
          </h4>

          {description && (
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
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
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenDropDown((prev) => !prev)}
            className="text-gray-700 dark:text-gray-400"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.99902 10.2451C6.96552 10.2451 7.74902 11.0286 7.74902 11.9951V12.0051C7.74902 12.9716 6.96552 13.7551 5.99902 13.7551C5.03253 13.7551 4.24902 12.9716 4.24902 12.0051V11.9951C4.24902 11.0286 5.03253 10.2451 5.99902 10.2451ZM17.999 10.2451C18.9655 10.2451 19.749 11.0286 19.749 11.9951V12.0051C19.749 12.9716 18.9655 13.7551 17.999 13.7551C17.0325 13.7551 16.249 12.9716 16.249 12.0051V11.9951C16.249 11.0286 17.0325 10.2451 17.999 10.2451ZM13.749 11.9951C13.749 11.0286 12.9655 10.2451 11.999 10.2451C11.0325 10.2451 10.249 11.0286 10.249 11.9951V12.0051C10.249 12.9716 11.0325 13.7551 11.999 13.7551C12.9655 13.7551 13.749 12.9716 13.749 12.0051V11.9951Z"
              />
            </svg>
          </button>

          {openDropDown && (
            <div
              className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark"
              onMouseLeave={() => setOpenDropDown(false)}
            >
              <button onClick={onEdit} className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                Edit
              </button>
              <button onClick={onDelete} className="flex w-full rounded-lg px-3 py-2 text-left text-theme-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
