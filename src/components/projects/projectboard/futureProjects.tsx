import React from "react";

interface Props {
  viewMode: "year" | "month";
  onChange: (mode: "year" | "month") => void;
}

const ViewModeToggle: React.FC<Props> = ({ viewMode, onChange }) => {
  const getButtonClass = (mode: "year" | "month") =>
    viewMode === mode
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => onChange("year")}
        className={`px-3 py-2 font-medium w-auto rounded-md text-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "year"
        )}`}
      >
        Year
      </button>
      <button
        onClick={() => onChange("month")}
        className={`px-3 py-2 font-medium w-auto rounded-md text-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "month"
        )}`}
      >
        Month
      </button>
    </div>
  );
};

export default ViewModeToggle;
