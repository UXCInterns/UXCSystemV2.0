import React, { useState, useRef, useEffect } from "react";

interface ExportDropdownProps {
  options: string[]; // e.g. ['Export as PDF', 'Export as CSV', 'Export as XLSX']
  onSelect: (format: string) => void;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
      >
        {/* Export Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 20h14v-2H5v2zm7-18L5.33 10h4.84v4h4.66v-4h4.84L12 2z"/>
        </svg>
        Export
        {/* Dropdown Arrow */}
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
          />
        </svg>
      </button>

      {open && (
        <ul className="absolute right-0 z-10 mt-2 w-44 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/10 dark:ring-white/10">
          {options.map(option => (
            <li
              key={option}
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
              className="px-4 py-2 cursor-pointer text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExportDropdown;
