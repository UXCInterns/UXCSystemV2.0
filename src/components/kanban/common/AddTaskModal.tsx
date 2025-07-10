import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import Badge from "../../ui/badge/Badge";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    description: string;
    date: string;
    status: string;
    priority: string;
  }) => void;
}

const statusOptions = ["To Do", "In Progress", "Review", "Completed"];
const priorityOptions = ["Low", "Medium", "High", "Urgent"];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300";
    case "Medium":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300";
    case "Low":
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300";
    default:
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "To Do":
      return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300";
    case "Review":
      return "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300";
    default:
      return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300";
  }
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Low");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onAddTask({ title, description, date, status, priority });
    setTitle("");
    setDescription("");
    setDate("");
    setStatus("To Do");
    setPriority("Low");
    onClose();
  };

  return (
    <div className={clsx("fixed inset-0 z-[99999] flex", !isOpen && "pointer-events-none")}>
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div
        className={clsx(
          "relative ml-auto h-screen w-[550px] bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-gray-300"
          aria-label="Close"
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.04 16.54a1 1 0 001.42 1.42L12 13.41l4.54 4.55a1 1 0 001.42-1.42L13.41 12l4.55-4.54a1 1 0 10-1.42-1.42L12 10.59 7.46 6.04a1 1 0 10-1.42 1.42L10.59 12l-4.55 4.54Z"
            />
          </svg>
        </button>

        <div className="absolute top-16 left-0 w-full border-b border-gray-200 dark:border-white/10" />

        {/* Form Content */}
        <div className="flex flex-col pt-20 px-6 lg:px-10 pb-6 h-full">
          <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
            <div className="flex flex-col space-y-6">
              {/* Title */}
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 w-full bg-transparent py-2.5 border-0 focus:outline-none text-[35px] text-gray-800 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  placeholder="Enter new item"
                  required
                />
              </div>

              {/* Assigned To */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-md font-medium text-gray-700 dark:text-gray-400">
                  Assigned To
                </label>
                <input
                  type="text"
                  placeholder="e.g. John"
                  className="flex-1 h-11 rounded-lg border-0 focus:outline-none bg-transparent px-4 text-md text-gray-800 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              {/* Status Dropdown with Colored Badge Items */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-md font-medium text-gray-700 dark:text-gray-400">
                  Status
                </label>
                <Listbox value={status} onChange={setStatus}>
                  <div className="relative w-full">
                    <Listbox.Button className="relative w-full ml-5 rounded-lg bg-white dark:bg-gray-900 py-2 pl-3 pr-10 text-left text-gray-900 dark:text-white focus:outline-none">
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          getStatusColor(status)
                        )}
                      >
                        {status}
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
                      {statusOptions.map((option) => (
                        <Listbox.Option
                          key={option}
                          value={option}
                          className={({ active }) =>
                            clsx(
                              "cursor-pointer select-none px-4 py-2",
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            )
                          }
                        >
                          <span
                            className={clsx(
                              "px-3 py-1 rounded-full text-sm font-medium",
                              getStatusColor(option)
                            )}
                          >
                            {option}
                          </span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>

              {/* Start Date */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-md font-medium text-gray-700 dark:text-gray-400">
                  Start Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 h-11 rounded-lg border-0 focus:outline-none bg-transparent px-4 text-md text-gray-800 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-md font-medium text-gray-700 dark:text-gray-400">
                  Due Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-1 h-11 rounded-lg border-0 focus:outline-none bg-transparent px-4 text-md text-gray-800 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              {/* Priority Dropdown with Colored Badge Items */}
              <div className="flex items-center gap-4">
                <label className="w-24 text-md font-medium text-gray-700 dark:text-gray-400">
                  Priority
                </label>
                <Listbox value={priority} onChange={setPriority}>
                  <div className="relative w-full">
                    <Listbox.Button className="relative w-full ml-5 rounded-lg bg-white dark:bg-gray-900 py-2 pl-3 pr-10 text-left text-gray-900 dark:text-white focus:outline-none">
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          getPriorityColor(priority)
                        )}
                      >
                        {priority}
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-sm ring-1 ring-black/5 focus:outline-none z-10">
                      {priorityOptions.map((option) => (
                        <Listbox.Option
                          key={option}
                          value={option}
                          className={({ active }) =>
                            clsx(
                              "cursor-pointer select-none px-4 py-2",
                              active ? "bg-gray-100 dark:bg-gray-700" : ""
                            )
                          }
                        >
                          <span
                            className={clsx(
                              "px-3 py-1 rounded-full text-sm font-medium",
                              getPriorityColor(option)
                            )}
                          >
                            {option}
                          </span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>

              {/* Description */}
              <div className="flex items-start gap-4">
                <label className="w-24 pt-2 text-md font-medium text-gray-700 dark:text-gray-400">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={description}
                  placeholder="Enter task description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-1 rounded-lg border-0 focus:outline-none bg-transparent px-4 py-2.5 text-md text-gray-800 placeholder:text-gray-400 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-6 py-2.5 text-sm text-white hover:bg-brand-700"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
