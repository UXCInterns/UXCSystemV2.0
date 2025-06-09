"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { InfoIcon, CheckCircleIcon } from "../../../icons";
import { initialData } from "./mapowerTable"; // Adjust path if needed

const getCurrentTheme = () => {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

// Define colors and icons for availability statuses
const availabilityConfig = {
  "Available": {
    icon: CheckCircleIcon,
    light: "rgb(16, 185, 129)",  // green
    dark: "rgb(16, 185, 129)",
  },
  "Very Busy": {
    icon: InfoIcon,
    light: "rgb(239, 68, 68)",   // red
    dark: "rgb(239, 68, 68)",
  },
  "Busy": {
    icon: InfoIcon,
    light: "rgb(245, 158, 11)", // yellow for better distinction
    dark: "rgb(245, 158, 11)",
  },
  // Add more availability statuses here if needed
};

const AvailabilityChartMetric = () => {
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

  // Aggregate availability counts from initialData
  const availabilityCounts: Record<string, number> = {};
  initialData.forEach(({ availability }) => {
    availabilityCounts[availability] = (availabilityCounts[availability] || 0) + 1;
  });

  const pieData = Object.entries(availabilityCounts).map(([status, count]) => ({
    name: status,
    value: count,
    color: availabilityConfig[status]?.[theme] || (theme === "dark" ? "#999" : "#ccc"),
  }));

  // Optional: define an order to show availability statuses in legend/chart
  const availabilityOrder = [ "Very Busy", "Busy", "Available"];
  pieData.sort(
    (a, b) => availabilityOrder.indexOf(a.name) - availabilityOrder.indexOf(b.name)
  );

  const total = initialData.length;
  const hoveredData = hoveredIndex !== null ? pieData[hoveredIndex] : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-2">Member Availability Distribution</h4>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="relative w-full h-59 md:w-1/2">
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
            const Icon = availabilityConfig[entry.name]?.icon || InfoIcon;
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

export default AvailabilityChartMetric;
