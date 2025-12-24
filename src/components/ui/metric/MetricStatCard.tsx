import React from "react";

interface MetricStatCardProps {
  label: string;
  value: string | number;
  badgeText?: string;
  badgeColor?: "blue" | "green" | "purple" | "orange";
  helperText?: string; // small text next to badge
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-500",
  green: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-500",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-500",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-500",
};

export const MetricStatCard: React.FC<MetricStatCardProps> = ({
  label,
  value,
  badgeText,
  badgeColor = "blue",
  helperText,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>

      <div className="mt-3 flex items-end justify-between">
        <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          {value}
        </h4>

        {badgeText && (
          <div className="flex items-center gap-1">
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                colorMap[badgeColor]
              }`}
            >
              {badgeText}
            </span>
            {helperText && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
