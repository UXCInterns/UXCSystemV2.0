import { useState } from "react";

const ChartTab: React.FC = () => {
  const [selected, setSelected] = useState<
    "optionOne" | "optionTwo"
  >("optionOne");

  const getButtonClass = (option: "optionOne" | "optionTwo") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => setSelected("optionOne")}
        className={`px-4 py-2.5 font-medium w-auto rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "optionOne"
        )}`}
      >
        PACE
      </button>

      <button
        onClick={() => setSelected("optionTwo")}
        className={`px-3 py-2.5 font-medium w-auto rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "optionTwo"
        )}`}
      >
        NON-PACE
      </button>
    </div>
  );
};

export default ChartTab;