"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import {   ArrowDownIcon, ArrowUpIcon, ShootingStarIcon, GroupIcon, BoltIcon } from "@/icons";

export const UXCMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="mt-5">
          <div>
            <span className="text-base text-gray-500 dark:text-gray-400">
              Companies <br /> Visited
            </span>
            <h4 className="mt-4 font-bold text-gray-800 text-title-sm dark:text-white/90">
              3,782
            </h4>
          </div>
          <div className="mt-5">
            <Badge color="success">
              <ArrowUpIcon />11.01%
            </Badge>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ShootingStarIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <div>
            <span className="text-base text-gray-500 dark:text-gray-400">
              Unique Companies <br /> Visited
            </span>
            <h4 className="mt-4 font-bold text-gray-800 text-title-sm dark:text-white/90">
              5,359
            </h4>
          </div>
          <div className="mt-5">
            <Badge color="error">
              <ArrowDownIcon className="text-error-500" />9.05%
            </Badge>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoltIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="mt-5">
          <div>
            <span className="text-base text-gray-500 dark:text-gray-400">
              Companies Visited &gt; <br /> Twice
            </span>
            <h4 className="mt-4 font-bold text-gray-800 text-title-sm dark:text-white/90">
              534
            </h4>
          </div>
          <div className="mt-5">
            <Badge color="error">
              <ArrowDownIcon className="text-error-500" />9.05%
            </Badge>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
