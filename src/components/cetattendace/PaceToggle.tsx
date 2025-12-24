interface ChartTabProps {
  selected: "pace" | "non_pace";
  onToggle: (type: "pace" | "non_pace") => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ selected, onToggle }) => {
  const getButtonClass = (option: "pace" | "non_pace") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-200 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => onToggle("pace")}
        className={`px-4 py-3 font-medium w-auto rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "pace"
        )}`}
      >
        PACE
      </button>
       
      <button
        onClick={() => onToggle("non_pace")}
        className={`p-3 font-medium w-auto rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "non_pace"
        )}`}
      >
        NON-PACE
      </button>
    </div>
  );
};

export default ChartTab;