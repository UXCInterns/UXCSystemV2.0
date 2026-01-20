"use client";

import React from "react";

interface CircleResultProps {
  title: string;
  yourScore: number;
  avgScore: number;
  unit: string;
}

export const CircleResult: React.FC<CircleResultProps> = React.memo(
  ({ title, yourScore, avgScore, unit }) => {
    const outerRadius = 70;
    const innerRadius = 54;
    const strokeWidth = 12;

    const outerCirc = 2 * Math.PI * outerRadius;
    const innerCirc = 2 * Math.PI * innerRadius;

    // Ensure scores are numbers between 0 and 100
    const safeAvg = Math.max(0, Math.min(Number(avgScore) || 0, 100));
    const safeYour = Math.max(0, Math.min(Number(yourScore) || 0, 100));

    // Compute stroke offsets
    const outerOffset = outerCirc * (1 - safeAvg / 100);
    const innerOffset = innerCirc * (1 - safeYour / 100);

    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 text-center">{title}</h3>

        <div className="relative w-48 h-48">
          {/* Grey background circle for outer */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r={outerRadius}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r={outerRadius}
              stroke="#93c5fd"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={outerCirc}
              strokeDashoffset={outerOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Grey background circle for inner */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r={innerRadius}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r={innerRadius}
              stroke="#10b981"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={innerCirc}
              strokeDashoffset={innerOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-800">
              {safeYour}
              {unit}
            </div>
            <div className="text-sm text-gray-500">Your Score</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-700">Your Result</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {safeYour}
              {unit}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-300" />
              <span className="text-sm text-gray-700">Session Avg</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {safeAvg}
              {unit}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

CircleResult.displayName = "CircleResult";
