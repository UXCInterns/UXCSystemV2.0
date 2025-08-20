"use client";

import React, { useState } from "react";
import Badge from "../ui/badge/Badge";
import {
  GroupIcon,
  BoltIcon,
} from "@/icons";
import { companyMetrics } from "@/hooks/useMetrics"; // ⬅️ import here

interface MetricProps {
  icon: React.ReactNode;
  titleTop: string;
  titleBottom: string;
  value: string;
  badgeText?: string;
  companies?: string[] // Optional badge
}

const MetricCard: React.FC<MetricProps> = ({
  icon,
  titleTop,
  titleBottom,
  value,
  badgeText,
  companies,
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className={`inset-0 transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-5 [backface-visibility:hidden]">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {icon}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {titleTop}
              </span>
              <span className="text-base text-gray-800 dark:text-white/90">
                {titleBottom}
              </span>
            </div>
          </div>

          {/* Value below */}
          <h2 className="font-bold text-gray-800 text-xl dark:text-white/90">
            {value}
          </h2>

          {/* Optional Badge */}
          {badgeText && (
            <div className="mt-2">
              <Badge>{badgeText}</Badge>
            </div>
          )}
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto custom-scrollbar">
          <h4 className="font-semibold mb-3 text-md">Companies</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {companies && companies.map((name, i) => (
              <li
                key={i}
                className="border-b border-gray-100 dark:border-gray-800 pb-2"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const IndustryMetrics = () => {
  return (
    <div className="flex flex-col gap-6">
      <MetricCard
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
        titleTop="Most Visited"
        titleBottom="Industry"
        value="Education"
        badgeText="Technology"
        companies={companyMetrics.total}
      />

      <MetricCard
        icon={<BoltIcon className="text-gray-800 size-6 dark:text-white/90" />}
        titleTop="Most Visited"
        titleBottom="Sector"
        value="Private"
        badgeText="Government"
        companies={companyMetrics.unique}
      />
    </div>
  );
};