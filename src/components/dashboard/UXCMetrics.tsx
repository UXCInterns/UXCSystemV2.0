"use client";

import React, { useState } from "react";
import Image from "next/image";
import Badge from "../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ShootingStarIcon,
  GroupIcon,
  BoltIcon,
} from "@/icons";
import { companyMetrics } from "@/hooks/useMetrics"; // ⬅️ import here

type MetricCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  badge: React.ReactNode;
  companies: string[];
};

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  title,
  value,
  badge,
  companies,
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped((prev) => !prev)}
    >
      <div
        className={`absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 [backface-visibility:hidden]">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {icon}
            </div>
            <div className="flex flex-col leading-tight">
              {title === "Visited Multiple Times" ? (
                <>
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                    Companies Visited
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Multiple Times
                  </span>
                </>
              ) : (
                <>
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                    {title}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Visited
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              {value}
            </h4>
            {badge}
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900 text-gray-800 dark:text-white [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-y-auto custom-scrollbar">
          <h4 className="font-semibold mb-3 text-md">Companies</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {companies.map((name, i) => (
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

export const UXCMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Light Mode Logo */}
      <div className="rounded-2xl border border-gray-200 p-6 dark:hidden dark:border-gray-800">
        <Image
          src="/images/logo/UXCLJ.png"
          alt="Light mode logo"
          width={600}
          height={400}
          className="rounded-lg"
        />
      </div>

      {/* Dark Mode Logo */}
      <div className="hidden rounded-2xl border border-gray-800 p-6 dark:bg-white/[0.03] dark:block">
        <Image
          src="/images/logo/UXCLJ-dark.png"
          alt="Dark mode logo"
          width={600}
          height={400}
          className="rounded-lg"
        />
      </div>

      <MetricCard
        icon={<GroupIcon className="text-gray-800 size-6 dark:text-white/90" />}
        title="Total Companies"
        value={companyMetrics.total.length.toString()}
        badge={
          <Badge color="success">
            <ArrowUpIcon /> 11.01%
          </Badge>
        }
        companies={companyMetrics.total}
      />

      <MetricCard
        icon={
          <ShootingStarIcon className="text-gray-800 dark:text-white/90" />
        }
        title="Unique Companies"
        value={companyMetrics.unique.length.toString()}
        badge={
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" /> 9.05%
          </Badge>
        }
        companies={companyMetrics.unique}
      />

      <MetricCard
        icon={<BoltIcon className="text-gray-800 dark:text-white/90" />}
        title="Visited Multiple Times"
        value={companyMetrics.multiple.length.toString()}
        badge={
          <Badge color="error">
            <ArrowDownIcon className="text-error-500" /> 9.05%
          </Badge>
        }
        companies={companyMetrics.multiple}
      />
    </div>
  );
};
