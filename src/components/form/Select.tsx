import { ChevronDown } from "lucide-react"; // Make sure to import your icon
import React, { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string; // for uncontrolled usage
  value?: string;        // for controlled usage
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
  value, // accepts controlled value
}) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [isOpen, setIsOpen] = useState(false); // Track if the select is open

  // Sync internal state if parent switches to controlled mode
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;

    // Update only if uncontrolled
    if (value === undefined) {
      setInternalValue(newValue);
    }

    onChange(newValue); // always notify parent
  };

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`relative ${className}`}>
      <select
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
          internalValue
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-400 dark:text-gray-400"
        }`}
        value={internalValue}
        onChange={handleChange}
        onClick={toggleDropdown} // Toggle dropdown on click
      >
        {/* Placeholder option */}
        <option
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Arrow Icon */}
      <div className={`absolute top-1/2 right-4 transform -translate-y-1/2 transition-transform duration-200 text-gray-700 dark:text-gray-400 ${isOpen ? 'rotate-180' : ''} pointer-events-none`}>
        <ChevronDown />
      </div>
    </div>
  );
};

export default Select;