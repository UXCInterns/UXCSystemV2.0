'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { UXCMetrics } from '@/components/home/UXCMetrics';
import MonthlySalesChart from '@/components/home/MonthlySalesChart';
import ProjectTable from '@/components/home/ProjectTable';
import RoleDistributionChart from '@/components/home/RoleMetricChart';

export default function Home() {
  const { name, profileImage } = useUser();
  const [time, setTime] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string | null>(null);

  useEffect(() => {
    // Set current date once on mount (client-side only)
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
      setTime(formattedTime);
    };

    update(); // initial set
    const interval = setInterval(update, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  // Optionally, render a loader if not hydrated yet
  if (!time || !currentDate) return null;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <div className="flex justify-between items-center gap-4 p-4 bg-white rounded-xl border dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Left Side: Welcome Message */}
          <div className="flex items-center gap-4">
            <Image
              src={profileImage}
              width={48}
              height={48}
              alt="Profile"
              className="rounded-full"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Welcome back, {name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check your activities in this dashboard
              </p>
            </div>
          </div>

          {/* Right Side: Date & Time */}
          <div className="text-right">
            <p className="text-sm text-gray-700 dark:text-gray-300">{currentDate}</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{time}</p>
          </div>
        </div>
      </div>

      <div className="col-span-12 space-y-6 xl:col-span-8">
        <UXCMetrics />
        <MonthlySalesChart />
        <ProjectTable />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <RoleDistributionChart />
      </div>

      <div className="col-span-12 space-y-6">
        {/* Footer / additional sections if any */}
      </div>
    </div>
  );
}
