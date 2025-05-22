"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { ArrowDownIcon, ArrowUpIcon, GroupIcon, BoxCubeIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";

const getCurrentTheme = () => {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
};

const dataSets = [
  {
    label: "No of Workshops",
    value: 10,
    percent: 11.01,
    icon: BoxCubeIcon,
    colors: {
      light: {
        icon: "#8B5CF6",
        bg: "#EDE9FE",
        chart: ["#8B5CF6", "#EDE9FE"]
      },
      dark: {
        icon: "#C084FC",
        bg: "#6B21A833",
        chart: ["#C084FC", "#6B21A833"]
      }
    }
  },
  {
    label: "No of Participants",
    value: 60,
    percent: -9.05,
    icon: GroupIcon,
    colors: {
      light: {
        icon: "#3B82F6",
        bg: "#DBEAFE",
        chart: ["#3B82F6", "#DBEAFE"]
      },
      dark: {
        icon: "#60A5FA",
        bg: "#1E40AF33",
        chart: ["#60A5FA", "#1E40AF33"]
      }
    }
  }
];

const CETMetrics = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(getCurrentTheme());

    // Optional: listen for theme change events if your app supports toggling
    const observer = new MutationObserver(() => {
      setTheme(getCurrentTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 md:gap-6">
      {dataSets.map(({ label, value, percent, icon: Icon, colors }, idx) => {
        const currentColors = colors[theme];
        const total = 100; // or the max possible / expected value for context
        const pieData = [
          { name: "value", value },
          { name: "remaining", value: Math.max(0, total - value) },
        ];

        const isPositive = percent >= 0;

        return (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col"
          >
            {/* Icon + Label side by side */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ backgroundColor: currentColors.bg }}
              >
                <Icon className="size-6" style={{ color: currentColors.icon }} />
              </div>
              <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                {label}
              </h4>
            </div>

            {/* Centered Donut Chart with number */}
            <div className="relative w-42 h-42 mx-auto flex-grow">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius="70%"
                    outerRadius="100%"
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, i) => (
                      <Cell fill={currentColors.chart[i]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-gray-800 dark:text-white/90">
                  {value.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Percentage change */}
            {/* Replace percentage change with Badge */}
            <div className="mt-7 flex justify-center">
              <Badge color={isPositive ? "success" : "error"}>
                {isPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {Math.abs(percent)}%
              </Badge>
              <span className="ml-2 text-gray-500 dark:text-gray-400 font-normal">
                from last period
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CETMetrics;
