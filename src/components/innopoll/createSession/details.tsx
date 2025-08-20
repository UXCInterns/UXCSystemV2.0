"use client";

import DatePicker from "@/components/form/date-picker";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateSessionSidebar = () => {
  const [sessionName, setSessionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCancel = () => {
    setSessionName("");
    setStartDate("");
    setEndDate("");
  };

  const handleCreateSession = () => {
    console.log({ sessionName, startDate, endDate });
  };

  const router = useRouter(); // ✅ Correct hook usage

  const handleCancelSession = () => {
    router.push("/innoPoll"); // ✅ navigate to create-session page
  };

  return (
    <div className="flex flex-col p-2 max-w-full mx-auto">
      <form className="flex flex-col gap-6">
        {/* Session Name */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Session Name
          </label>
          <input
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Enter session name"
            className="w-full dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
          />
        </div>

        {/* Start Date */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Start Date
          </label>
          <div className="relative">
            <DatePicker
              id="start-date-picker"
              placeholder="Select a date"
              onChange={(dates) => {
                if (dates.length > 0) {
                  setStartDate(dates[0].toISOString().split("T")[0]);
                } else {
                  setStartDate("");
                }
              }}
              
            />
          </div>
        </div>

        {/* End Date */}
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            End Date
          </label>
          <div className="relative">
            <DatePicker
              id="end-date-picker"
              placeholder="Select a date"
              onChange={(dates) => {
                if (dates.length > 0) {
                  setEndDate(dates[0].toISOString().split("T")[0]);
                } else {
                  setEndDate("");
                }
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              handleCancel();
              handleCancelSession();
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateSession}
            className="w-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white"
          >
            Create Session
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSessionSidebar;
