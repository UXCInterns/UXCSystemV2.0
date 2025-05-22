import { useState } from "react";

interface Props {
  selectedType: "area" | "bar";
  onChange: (type: "area" | "bar") => void;
}

const ChartTypeToggle: React.FC<Props> = ({ selectedType, onChange }) => {
  const getButtonClass = (type: "area" | "bar") =>
    selectedType === type
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => onChange("area")}
        className={`px-3 py-2 font-medium w-auto rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "area"
        )}`}
      >
        Area
      </button>
      <button
        onClick={() => onChange("bar")}
        className={`px-3 py-2 font-medium w-auto rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "bar"
        )}`}
      >
        Bar
      </button>
    </div>
  );
};

export default ChartTypeToggle;
