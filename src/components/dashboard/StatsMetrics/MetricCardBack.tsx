// Back side of metric card showing company list
import React from "react";

interface MetricCardBackProps {
  companies: string[];
}

export const MetricCardBack = ({ companies }: MetricCardBackProps) => {
  return (
    <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto custom-scrollbar">
      <h4 className="font-semibold mb-3 text-md">Companies</h4>
      {companies.length > 0 ? (
        <ul className="space-y-2 text-sm text-gray-400">
          {companies.map((name, i) => (
            <li key={i} className="border-b border-gray-100 dark:border-gray-800 pb-2">
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No companies found for this period.
        </p>
      )}
    </div>
  );
};