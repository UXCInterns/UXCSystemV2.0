"use client";

import React from "react";

interface RadialChartProps {
  score: number;
  color: string;
  radius?: number;
}

const RadialChart: React.FC<RadialChartProps> = ({
  score,
  color,
  radius = 70,
}) => {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
        {/* Outer glow ring */}
        <circle
          cx="100"
          cy="100"
          r={radius + 5}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={0.2}
        />

        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="white"
          stroke="#f3f4f6"
          strokeWidth={18}
        />

        {/* Progress arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={18}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          className="transition-all duration-1000"
        />

        {/* Center score */}
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-5xl font-black"
          fill={color}
        >
          {score}
          <tspan dx={4} className="text-2xl font-medium" fill="#9ca3af">
            %
          </tspan>
        </text>
      </svg>
    </div>
  );
};

export default RadialChart;
