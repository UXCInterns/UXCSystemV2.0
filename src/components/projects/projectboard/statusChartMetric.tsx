"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { InfoIcon, CheckCircleIcon } from "../../../icons";
import { useProjectData } from "@/hooks/project/useProjectData";

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
    light: "rgb(245, 158, 11)",
    dark: "rgb(245, 158, 11)",
  },
};

const StatusChartMetric = () => {
  const [theme, setTheme] = useState("light");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { projects, statusCounts, totalProjects } = useProjectData();

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

  // Convert statusCounts to the format needed for the pie chart
  const pieData = [
    {
      name: "Completed",
      value: statusCounts.completed,
      color: statusConfig["Completed"]?.[theme],
    },
    {
      name: "In Progress", 
      value: statusCounts.inProgress,
      color: statusConfig["In Progress"]?.[theme],
    },
    {
      name: "Aborted",
      value: statusCounts.aborted,
      color: statusConfig["Aborted"]?.[theme],
    },
    {
      name: "Pending",
      value: statusCounts.pending,
      color: statusConfig["Pending"]?.[theme],
    },
  ].filter(item => item.value > 0);

  const hoveredData = hoveredIndex !== null ? pieData[hoveredIndex] : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-4 text-center">
        Project Status Distribution
      </h4>

      {/* Chart */}
      <div className="relative w-full h-64 mb-6">
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
            {hoveredData ? hoveredData.value : totalProjects}
          </span>
        </div>
      </div>

      {/* Legend (2x2 grid) */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {pieData.map((entry, idx) => {
          const Icon = statusConfig[entry.name]?.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <Icon
                className={`size-6 ${Icon === InfoIcon ? "rotate-180" : ""}`}
                style={{ color: entry.color }}
              />
              <div>
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium block">
                  {entry.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.value} ({((entry.value / totalProjects) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusChartMetric;
