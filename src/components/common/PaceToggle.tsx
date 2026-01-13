import React, { useState } from "react";
import Notification from "@/components/ui/notification/Notification"; // adjust path to your Notification component

const ChartTab: React.FC<{
  selected: "pace" | "non_pace";
  onSelect: (option: "pace" | "non_pace") => void;
}> = ({ selected, onSelect }) => {
  const [notification, setNotification] = useState<string | null>(null);

  const getButtonClass = (option: "pace" | "non_pace") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  const handleToggle = (option: "pace" | "non_pace") => {
    onSelect(option);
    setNotification(`Success! ${option === "pace" ? "Pace" : "Non-Pace"} selected!`);
  };

  return (
    <>
      <div className="flex w-full sm:w-auto gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
        <button
          onClick={() => handleToggle("pace")}
          className={`flex-1 sm:flex-none text-center px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
            "pace"
          )}`}
        >
          PACE
        </button>

        <button
          onClick={() => handleToggle("non_pace")}
          className={`flex-1 sm:flex-none text-center px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
            "non_pace"
          )}`}
        >
          NON-PACE
        </button>
      </div>

      {/* Render notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-9999">
          <Notification
            type="success"
            message={notification} // Pass message directly
            autoClose
            duration={3000}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
    </>
  );
};

export default ChartTab;