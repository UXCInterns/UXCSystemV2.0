import React from "react";

interface ImportExcelButtonProps {
  onClick: () => void;
}

const ImportExcelButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M19 15v4H5v-4H3v6h18v-6h-2zM13 3h-2v10H7l5 5 5-5h-4V3z" />
      </svg>

      Import
    </button>
  );
};

export default ImportExcelButton;