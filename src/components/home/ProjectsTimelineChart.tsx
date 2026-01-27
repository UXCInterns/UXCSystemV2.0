"use client";

import React, { useState, useEffect } from "react";
import { Calendar, TrendingUp } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { useUser } from "@/hooks/useUser";

interface TeamMember {
  id: string;
  name?: string;
  email?: string;
}

interface Project {
  id: string;
  project_name: string;
  status: string;
  start_date: string;
  end_date: string;
  progress: number;
  project_manager: TeamMember | null;
  project_lead: TeamMember | null;
  core_team: TeamMember[] | null;
  support_team: TeamMember[] | null;
}

interface MonthData {
  month: string;
  year: number;
  count: number;
  projects: Project[];
}

export const ProjectsTimelineChart = () => {
  const { id: userId, loading: userLoading } = useUser();
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectsTimeline = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/projects");
        const data = await response.json();

        // Filter projects where the user is assigned
        const userProjects = (data.projects || []).filter(
          (project: Project) => {
            const isNotCancelled = project.status !== "Cancelled";
            
            const isAssigned =
              project.project_manager?.id === userId ||
              project.project_lead?.id === userId ||
              project.core_team?.some((member) => member.id === userId) ||
              project.support_team?.some((member) => member.id === userId);

            return isNotCancelled && isAssigned;
          }
        );

        const currentYear = new Date().getFullYear();
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        const monthlyMap: Record<string, MonthData> = {};
        months.forEach((month, index) => {
          const key = `${currentYear}-${index}`;
          monthlyMap[key] = {
            month,
            year: currentYear,
            count: 0,
            projects: [],
          };
        });

        userProjects.forEach((project: Project) => {
          const startDate = new Date(project.start_date);
          const endDate = new Date(project.end_date);

          if (
            startDate.getFullYear() <= currentYear &&
            endDate.getFullYear() >= currentYear
          ) {
            const startMonth =
              startDate.getFullYear() === currentYear
                ? startDate.getMonth()
                : 0;
            const endMonth =
              endDate.getFullYear() === currentYear
                ? endDate.getMonth()
                : 11;

            for (let monthIndex = startMonth; monthIndex <= endMonth; monthIndex++) {
              const key = `${currentYear}-${monthIndex}`;
              if (
                monthlyMap[key] &&
                !monthlyMap[key].projects.find(p => p.id === project.id)
              ) {
                monthlyMap[key].count++;
                monthlyMap[key].projects.push(project);
              }
            }
          }
        });

        setMonthlyData(Object.values(monthlyMap));
      } catch (error) {
        console.error("Error fetching projects timeline:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProjectsTimeline();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const getBarHeight = (count: number) => {
    if (monthlyData.length === 0) return 0;
    const maxCount = Math.max(...monthlyData.map(m => m.count), 1);
    return (count / maxCount) * 100;
  };

  const getBarColor = (count: number) => {
    if (count === 0)
      return "from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600";
    if (count <= 2) return "from-emerald-500 to-teal-600";
    if (count <= 4) return "from-blue-500 to-blue-600";
    if (count <= 6) return "from-amber-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  if (loading || userLoading) {
    return (
      <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-3 sm:p-4 md:p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="h-5 sm:h-6 bg-gray-200 rounded dark:bg-gray-700 w-32 sm:w-48 animate-pulse mb-2" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded dark:bg-gray-700 w-48 sm:w-64 animate-pulse" />
        </div>
        <div className="p-3 sm:p-4 md:p-5">
          <div className="h-40 sm:h-48 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
    );
  }

  const totalProjects = monthlyData.reduce(
    (max, m) => Math.max(max, m.count),
    0
  );
  const currentMonth = new Date().getMonth();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30 transition-transform duration-300 group-hover:scale-110">
              <Calendar className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                My Projects Timeline
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Your active projects throughout {new Date().getFullYear()}
              </p>
            </div>
          </div>
          <Badge
            variant="light"
            size="sm"
            color="info"
            startIcon={<TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
          >
            Peak: {totalProjects}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        {/* Chart */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-end justify-between gap-1 sm:gap-2 h-40 sm:h-48">
            {monthlyData.map((data, index) => {
              const height = getBarHeight(data.count);
              const isCurrentMonth = index === currentMonth;

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-1 sm:gap-2 group"
                >
                  <div className="w-full flex flex-col justify-end h-32 sm:h-40 relative">
                    <div
                      className={`w-full bg-gradient-to-t ${getBarColor(
                        data.count
                      )} rounded-t-md sm:rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer touch-manipulation active:scale-95`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div
                    className={`text-[9px] sm:text-xs font-medium ${
                      isCurrentMonth
                        ? "text-blue-600 dark:text-blue-400 font-bold"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {data.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600" />
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              1–2 projects
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600" />
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              3–4 projects
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-600" />
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              5–6 projects
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br from-red-500 to-red-600" />
            <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
              7+ projects
            </span>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="mt-4 sm:mt-6">
          <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-gray-800 mb-3">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              Monthly Breakdown
            </h4>
          </div>

          <div className="overflow-x-auto overflow-y-auto h-[370px] border border-gray-200 dark:border-gray-800 rounded-lg custom-scrollbar">
            <table className="w-full min-w-[500px]">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Month
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase whitespace-nowrap">
                    Active Projects
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Project Names
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => {
                  const isCurrentMonth = index === currentMonth;

                  return (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] ${
                        isCurrentMonth
                          ? "bg-blue-50/50 dark:bg-blue-900/10"
                          : ""
                      }`}
                    >
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                            {data.month} {data.year}
                          </span>
                          {isCurrentMonth && (
                            <Badge variant="light" size="sm" color="info">
                              Current
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-bold">
                        {data.count}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3">
                        {data.count > 0 ? (
                          <div className="flex flex-col gap-1">
                            {data.projects.map(project => (
                              <div key={project.id} className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                <Badge variant="light" size="sm">
                                  {project.status}
                                </Badge>
                                <span className="text-xs sm:text-sm truncate max-w-[200px] sm:max-w-none">
                                  {project.project_name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] sm:text-xs italic text-gray-400">
                            No projects
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};