"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { InfoIcon, CheckCircleIcon, GridIcon, UserCogIcon } from "../../icons"; // You can customize these
import { projectData } from "./ProjectTable"; // Adjust path if needed

const getCurrentTheme = () => {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const roleConfig = {
  Support: {
    icon: UserCogIcon,
    light: "rgb(16, 185, 129)",     // green
    dark: "rgb(16, 185, 129)",
  },
  Core: {
    icon: GridIcon,
    light: "rgb(59, 130, 246)",     // blue
    dark: "rgb(59, 130, 246)",
  },
  Lead: {
    icon: InfoIcon,
    light: "rgb(245, 158, 11)",     // yellow
    dark: "rgb(245, 158, 11)",
  },
  Manager: {
    icon: CheckCircleIcon,
    light: "rgb(239, 68, 68)",      // red
    dark: "rgb(239, 68, 68)",
  },
};

const RoleDistributionChart = () => {
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

  // Aggregate role counts
  const roleCounts: Record<string, number> = {};
  projectData.forEach(({ roles }) => {
    roles.forEach((role) => {
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
  });

  const pieData = Object.entries(roleCounts).map(([role, count]) => ({
    name: role,
    value: count,
    color: roleConfig[role]?.[theme],
  }));

  const roleOrder = ["Manager", "Lead", "Support", "Core"];
  pieData.sort((a, b) => roleOrder.indexOf(a.name) - roleOrder.indexOf(b.name));

  const totalRoles = Object.values(roleCounts).reduce((a, b) => a + b, 0);
  const hoveredData = hoveredIndex !== null ? pieData[hoveredIndex] : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
        Role Distribution Across Projects
      </h4>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="relative w-full h-54 md:w-1/2">
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
              {hoveredData ? hoveredData.value : totalRoles}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center gap-3 md:w-1/2">
          {pieData.map((entry, idx) => {
            const Icon = roleConfig[entry.name]?.icon;
            return (
              <div key={idx} className="flex items-center gap-3">
                <Icon
                  className={`size-6 ${Icon === InfoIcon ? "rotate-180" : ""}, ${Icon === GridIcon ? "rotate-45" : ""}`}
                  style={{ color: entry.color }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium w-24">{entry.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {entry.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleDistributionChart;
