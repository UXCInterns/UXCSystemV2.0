'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/hooks/useUser';
import { UXCMetrics } from '@/components/home/UXCMetrics';
import { ProjectsGrid } from '@/components/home/ProjectsGrid';
import { TasksGrid } from '@/components/home/TasksGrid';
import { ProjectsTimelineChart } from '@/components/home/ProjectsTimelineChart';
import { WorkloadBalance } from '@/components/home/WorkloadBalance';
// import RecentUpdates from '@/components/home/Chart';

// import ProjectTable from '@/components/home/ProjectTable';

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
    <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-6">
      <div className="col-span-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Left Side: Welcome Message */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Image
              src={profileImage}
              width={40}
              height={40}
              alt="Profile"
              className="rounded-full sm:w-12 sm:h-12"
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                Welcome back, {name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Check your activities in this dashboard
              </p>
            </div>
          </div>

          {/* Right Side: Date & Time */}
          <div className="hidden sm:block text-right">
            <p className="text-sm sm:text-base md:text-lg text-gray-900 dark:text-white">
              {currentDate}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              {time}
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-12 space-y-4 sm:space-y-6 xl:col-span-8">
        <UXCMetrics />
        <ProjectsGrid />
        {/* <ProjectTable /> */}
      </div>

      <div className="col-span-12 space-y-4 sm:space-y-6 xl:col-span-4">
        <TasksGrid />
      </div>
      <div className="col-span-12 space-y-4 sm:space-y-6 xl:col-span-4">
        <WorkloadBalance />
      </div>
      <div className="col-span-12 space-y-4 sm:space-y-6 xl:col-span-8">
        <ProjectsTimelineChart />
      </div>

      <div className="col-span-12 space-y-4 sm:space-y-6 xl:col-span-4">

      </div>
    </div>
  );
}