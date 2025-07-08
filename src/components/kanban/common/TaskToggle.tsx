  import { useState } from "react";

  type TaskTabProps = {
    counts: {
      all: number;
      todo: number;
      inprogress: number;
      completed: number;
    };
  };

  const TaskTab: React.FC<TaskTabProps> = ({ counts }) => {
    const [selected, setSelected] = useState<
      "optionOne" | "optionTwo" | "optionThree" | "optionFour"
    >("optionOne");

    const getButtonClass = (option: typeof selected) =>
      selected === option
        ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
        : "text-gray-500 dark:text-gray-400";

    const getBadgeClass = (option: typeof selected) =>
      selected === option
        ? "text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/15"
        : "bg-white dark:bg-white/[0.03]";

    return (
      <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
        <button
          onClick={() => setSelected("optionOne")}
          className={`flex items-center gap-2 px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("optionOne")}`}
        >
          All Tasks
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal ${getBadgeClass("optionOne")}`}>
            {counts.all}
          </span>
        </button>

        <button
          onClick={() => setSelected("optionTwo")}
          className={`flex items-center gap-2 px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("optionTwo")}`}
        >
          To Do
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal ${getBadgeClass("optionTwo")}`}>
            {counts.todo}
          </span>
        </button>

        <button
          onClick={() => setSelected("optionThree")}
          className={`flex items-center gap-2 px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("optionThree")}`}
        >
          In Progress
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal ${getBadgeClass("optionThree")}`}>
            {counts.inprogress}
          </span>
        </button>

        <button
          onClick={() => setSelected("optionFour")}
          className={`flex items-center gap-2 px-3 py-2 font-medium rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("optionFour")}`}
        >
          Completed
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal ${getBadgeClass("optionFour")}`}>
            {counts.completed}
          </span>
        </button>
      </div>
    );
  };

  export default TaskTab;
