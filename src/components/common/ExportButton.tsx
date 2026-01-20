import React from "react";

interface ExportExcelButtonProps {
  onExport: () => void;
}

const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({ onExport }) => {
  return (
    <button
      onClick={onExport}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
    >
      {/* Export Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M5 20h14v-2H5v2zm7-18L5.33 10h4.84v4h4.66v-4h4.84L12 2z" />
      </svg>

      Export
    </button>
  );
};

export default ExportExcelButton;
