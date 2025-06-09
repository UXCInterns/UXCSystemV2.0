"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { InfoIcon, CheckCircleIcon } from "../../../icons";
import { initialData } from "./currentProjects"; // Adjust path if needed
import { futureData } from "./futureProjects"; // Adjust path if needed

const getCurrentTheme = () => {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const statusConfig = {
  "Completed": {
    icon: CheckCircleIcon,
    light: "rgb(16, 185, 129)",
    dark: "rgb(16, 185, 129)",
  },
  "In Progress": {
    icon: InfoIcon,
    light: "rgb(59, 130, 246)",
    dark: "rgb(59, 130, 246)",
  },
  "Aborted": {
    icon: InfoIcon,
    light: "rgb(239, 68, 68)",
    dark: "rgb(239, 68, 68)",
  },
  "Pending": {
    icon: InfoIcon,
    light: "rgb(245, 158, 11)", // yellow for better distinction
    dark: "rgb(245, 158, 11)",
  },
};

const StatusChartMetric = () => {
  const [theme, setTheme] = useState("light");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setTheme(getCurrentTheme());

    const observer = new MutationObserver(() => {
      setTheme(getCurrentTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Merge data from current and future projects
  const allProjects = [...initialData, ...futureData];

  // Aggregate status counts
  const statusCounts: Record<string, number> = {};
  allProjects.forEach(({ status }) => {
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusConfig[status]?.[theme],
  }));

  const statusOrder = ["Completed", "In Progress", "Aborted", "Pending"];
  pieData.sort(
    (a, b) => statusOrder.indexOf(a.name) - statusOrder.indexOf(b.name)
  );

  const total = allProjects.length;
  const hoveredData = hoveredIndex !== null ? pieData[hoveredIndex] : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">Project Status Distribution</h4>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="relative w-full h-64 md:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius="60%"
                outerRadius="100%"
                stroke="none"
                startAngle={90}
                endAngle={-270}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    fillOpacity={hoveredIndex === index ? 1 : 0.5}
                    onMouseEnter={() => setHoveredIndex(index)}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="font-semibold text-gray-600 dark:text-white/80">
              {hoveredData ? hoveredData.name : "Total"}
            </span>
            <span className="text-3xl font-extrabold text-gray-800 dark:text-white/90">
              {hoveredData ? hoveredData.value : total}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center gap-4 md:w-1/2">
          {pieData.map((entry, idx) => {
            const Icon = statusConfig[entry.name]?.icon;
            return (
              <div key={idx} className="flex items-center gap-3">
                <Icon
                  className={`size-6 ${Icon === InfoIcon ? "rotate-180" : ""}`}
                  style={{ color: entry.color }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium w-24">{entry.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.value} ({((entry.value / total) * 100).toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatusChartMetric;
