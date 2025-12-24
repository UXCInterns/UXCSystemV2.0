"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Calendar, TrendingUp } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";

interface Project {
  id: string;
  project_name: string;
  status: string;
  start_date: string;
  end_date: string;
  progress: number;
}

interface MonthData {
  month: string;
  year: number;
  count: number;
  projects: Project[];
}

export const ProjectsTimelineChart = () => {
  const [monthlyData, setMonthlyData] = useState<MonthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchProjectsTimeline = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        const data = await response.json();

        const userProjects = (data.projects || []).filter((project: Project) => {
          return project.status !== 'Cancelled';
        });

        const currentYear = new Date().getFullYear();
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
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

          if (startDate.getFullYear() <= currentYear && endDate.getFullYear() >= currentYear) {
            const startMonth = startDate.getFullYear() === currentYear ? startDate.getMonth() : 0;
            const endMonth = endDate.getFullYear() === currentYear ? endDate.getMonth() : 11;

            for (let monthIndex = startMonth; monthIndex <= endMonth; monthIndex++) {
              const key = `${currentYear}-${monthIndex}`;
              if (monthlyMap[key]) {
                if (!monthlyMap[key].projects.find(p => p.id === project.id)) {
                  monthlyMap[key].count++;
                  monthlyMap[key].projects.push(project);
                }
              }
            }
          }
        });

        const monthlyArray = Object.values(monthlyMap);
        setMonthlyData(monthlyArray);
      } catch (error) {
        console.error('Error fetching projects timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsTimeline();
  }, []);

  const getBarHeight = (count: number) => {
    if (monthlyData.length === 0) return 0;
    const maxCount = Math.max(...monthlyData.map(m => m.count), 1);
    return (count / maxCount) * 100;
  };

  const getBarColor = (count: number) => {
    if (count === 0) return 'from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600';
    if (count <= 2) return 'from-emerald-500 to-teal-600';
    if (count <= 4) return 'from-blue-500 to-blue-600';
    if (count <= 6) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-48 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-64 animate-pulse" />
        </div>
        <div className="p-5">
          <div className="h-48 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
    );
  }

  const totalProjects = monthlyData.reduce((sum, m) => Math.max(sum, m.count), 0);
  const currentMonth = new Date().getMonth();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
              <Calendar className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Projects Timeline
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active projects throughout {new Date().getFullYear()}
              </p>
            </div>
          </div>
          <Badge variant="light" size="sm" color="info" startIcon={<TrendingUp className="w-3 h-3" />}>
            Peak: {totalProjects}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        {/* Chart */}
        <div className="mb-6">
          <div className="flex items-end justify-between gap-2 h-48">
            {monthlyData.map((data, index) => {
              const height = getBarHeight(data.count);
              const isCurrentMonth = index === currentMonth;
              
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2 group"
                >
                  {/* Bar */}
                  <div className="w-full flex flex-col justify-end h-40 relative">
                    <div
                      className={`w-full bg-gradient-to-t ${getBarColor(data.count)} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group-hover:shadow-lg`}
                      style={{ height: `${height}%` }}
                    >
                      {/* Count label */}
                      {data.count > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.count}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Month label */}
                  <div className={`text-xs font-medium ${
                    isCurrentMonth 
                      ? 'text-blue-600 dark:text-blue-400 font-bold' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {data.month}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">1-2 projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">3-4 projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">5-6 projects</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-red-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">7+ projects</span>
          </div>
        </div>

        {/* Expandable Monthly Breakdown */}
        <div className="mt-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors border border-gray-200 dark:border-gray-800"
          >
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Monthly Breakdown
            </h4>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {/* Expandable Content with Fixed Height */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-53 mt-3' : 'max-h-0'
            }`}
          >
            <div className="overflow-y-auto max-h-53 border border-gray-200 dark:border-gray-800 rounded-lg custom-scrollbar">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Active Projects
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Project Names
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-transparent">
                  {monthlyData.map((data, index) => {
                    const isCurrentMonth = index === currentMonth;
                    
                    return (
                      <tr 
                        key={index}
                        className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${
                          isCurrentMonth ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              isCurrentMonth 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {data.month} {data.year}
                            </span>
                            {isCurrentMonth && (
                              <Badge variant="light" size="sm" color="info">
                                Current
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-sm font-bold ${
                            data.count === 0 
                              ? 'text-gray-400 dark:text-gray-600' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {data.count}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {data.count > 0 ? (
                            <div className="flex flex-col gap-1">
                              {data.projects.map((project) => (
                                <div key={project.id} className="flex items-center gap-2">
                                  <Badge 
                                    variant="light" 
                                    size="sm" 
                                    color={
                                      project.status === 'Completed' ? 'success' :
                                      project.status === 'In Progress' ? 'info' :
                                      project.status === 'On Hold' ? 'warning' : 'light'
                                    }
                                  >
                                    {project.status}
                                  </Badge>
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {project.project_name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-600 italic">
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
    </div>
  );
}