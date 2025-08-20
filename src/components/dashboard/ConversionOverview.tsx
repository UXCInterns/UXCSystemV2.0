"use client";

import React, { useState } from "react";
import { TrendingUp, GraduationCap, BriefcaseIcon } from "lucide-react";
import { companyMetrics } from "@/hooks/useMetrics";

export const ConversionsOverview = () => {
  const [flipped, setFlipped] = useState(false);

  // Dynamically count companies
  const trainingCompanies = companyMetrics.training || [];
  const consultancyCompanies = companyMetrics.consultancy || [];
  const trainingCount = trainingCompanies.length;
  const consultancyCount = consultancyCompanies.length;

  const totalCompanies = companyMetrics.total.length;
  const totalConversions = trainingCount + consultancyCount;
  const totalPercentage = totalCompanies
    ? ((totalConversions / totalCompanies) * 100).toFixed(1)
    : 0;

  const data = [
    {
      name: "Training",
      value: trainingCount,
      color: "#465FFF",
      icon: (
        <GraduationCap className="text-gray-700 w-6 h-6 dark:text-white/90" />
      ),
    },
    {
      name: "Consultancy",
      value: consultancyCount,
      color: "#10b981",
      icon: (
        <BriefcaseIcon className="text-gray-700 w-6 h-6 dark:text-white/90" />
      ),
    },
  ];

  return (
    <div
      className="relative w-full cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className={`w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="inset-0 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] w-full mx-auto [backface-visibility:hidden]">
          <h4 className="text-lg font-semibold text-gray-500 dark:text-gray-100 mb-6">
            Conversions Overview
          </h4>

          {/* Total Conversions with Progress */}
          <div className="mb-6 flex flex-col gap-2 p-4 bg-gray-100 dark:bg-white/3 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-900">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                  Total Conversions
                </span>
                <span className="text-3xl font-extrabold text-gray-800 dark:text-white">
                  {totalConversions}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-4 rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-4 rounded-full"
                  style={{ width: `${totalPercentage}%`, backgroundColor: "#22c55e" }}
                />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                {totalPercentage}%
              </span>
            </div>
          </div>

          {/* Training / Consultancy Bars */}
          <div className="flex flex-col gap-4">
            {data.map((item) => {
              const percentage = totalConversions
                ? ((item.value / totalConversions) * 100).toFixed(1)
                : 0;
              return (
                <div key={item.name} className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    {item.icon}
                  </div>

                  {/* Name and Value */}
                  <div className="flex flex-col w-32">
                    <span className="text-md font-medium text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">
                      {item.value}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto">
          <h4 className="text-lg font-semibold mb-4">Companies</h4>
          <div className="flex gap-6">
            {/* Training Column */}
            <div className="flex-1">
              <h5 className="font-medium mb-2">Training</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                {trainingCompanies.length ? (
                  trainingCompanies.map((name, i) => (
                    <li
                      key={i}
                      className="border-b border-gray-100 dark:border-gray-800 pb-1"
                    >
                      {name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No training companies</li>
                )}
              </ul>
            </div>

            {/* Consultancy Column */}
            <div className="flex-1">
              <h5 className="font-medium mb-2">Consultancy</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                {consultancyCompanies.length ? (
                  consultancyCompanies.map((name, i) => (
                    <li
                      key={i}
                      className="border-b border-gray-100 dark:border-gray-800 pb-1"
                    >
                      {name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No consultancy companies</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
