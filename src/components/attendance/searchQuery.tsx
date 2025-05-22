import React from "react";

interface SearchQueryProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchQuery({
  value,
  onChange,
}: SearchQueryProps) {
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by company name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-white/[0.1] dark:text-white"
      />
    </div>
  );
}
