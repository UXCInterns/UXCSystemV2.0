"use client";
import DatePicker from "@/components/form/date-picker";
import React, { useState } from "react";

interface EditTaskModalProps {
  task: { title: string; description?: string; date: string; status: string; };
  onClose: () => void;
  onSave: (updatedTask: { title: string; description?: string; date: string; status: string; }) => void;
}

export default function EditTaskModal({ task, onClose, onSave }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [date, setDate] = useState(task.date);
  const [status, setStatus] = useState(task.status);

  const handleSubmit = () => {
    onSave({ title, description, date, status });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto z-[99999]">
      <div
        className="fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-[32px]"
        onClick={onClose}
      ></div>
      <div className="relative z-10 w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-11">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Add a new task
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          Effortlessly manage your to-do list: add a new task
        </p>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <svg
            className="fill-current size-5 sm:size-6"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.04 16.54a1 1 0 0 0 1.42 1.42L12 13.41l4.54 4.55a1 1 0 0 0 1.42-1.42L13.41 12l4.55-4.54a1 1 0 1 0-1.42-1.42L12 10.59 7.46 6.04a1 1 0 0 0-1.42 1.42L10.59 12l-4.55 4.54Z"
            />
          </svg>
        </button>
          <div className="custom-scrollbar h-[380px] overflow-y-auto px-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                  placeholder="Enter task title"
                  required
                />
              </div>

              {/* Status */}
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Status
                    </label>
                    <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                    >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                    </select>
                </div>
              
              {/* Due Date */}
              <div className="flex-1">
                <DatePicker
                 id="date-picker"
                 label={<>Due Date</>}
                 placeholder="Select a date"
                 onChange={(date) => setDate(date)}
                 selected={date}
                />
              </div> 

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Description
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                ></textarea>
              </div>
            </div>
          </div>
        <div className="flex justify-end mt-4 space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
