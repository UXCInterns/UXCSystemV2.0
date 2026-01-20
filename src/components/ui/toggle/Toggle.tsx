import React from "react";

interface ToggleOption {
  value: string;
  label: string;
}

interface Props<T extends string> {
  options: ToggleOption[];
  selectedValue: T;
  onChange: (value: T) => void;
  className?: string;
}

const Toggle = <T extends string>({ 
  options, 
  selectedValue, 
  onChange,
  className = ""
}: Props<T>) => {
  const getButtonClass = (value: string) =>
    selectedValue === value
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className={`flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value as T)}
          className={`flex-1 px-3 py-3 font-medium w-auto rounded-md text-xs md:text-sm hover:text-gray-900 dark:hover:text-white transition-colors ${getButtonClass(
            option.value
          )}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Toggle;