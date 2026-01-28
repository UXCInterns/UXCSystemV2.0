"use client";

import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { useUser } from "@/hooks/useUser";
import {
  BarChart3Icon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  FlagIcon,
  ListChecksIcon,
  ZapIcon,
  AlertTriangleIcon,
} from "lucide-react";

interface Task {
  id: string;
  status: string;
  priority: string;
  due_date: string;
  [key: string]: unknown;
}

interface WorkloadData {
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  dueThisWeek: number;
  overdue: number;
  total: number;
}

export const WorkloadBalance = () => {
  const { id: userId, loading: userLoading } = useUser();
  const [workload, setWorkload] = useState<WorkloadData>({
    byStatus: {},
    byPriority: {},
    dueThisWeek: 0,
    overdue: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkload = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/tasks?assigned_to_id=${userId}`);
        const data = await response.json();

        const activeTasks = (data.tasks || []).filter(
          (task: Task) => task.status !== 'Done' && task.status !== 'Cancelled'
        );

        // Group by status
        const byStatus: Record<string, number> = {};
        activeTasks.forEach((task: Task) => {
          byStatus[task.status] = (byStatus[task.status] || 0) + 1;
        });

        // Group by priority
        const byPriority: Record<string, number> = {};
        activeTasks.forEach((task: Task) => {
          byPriority[task.priority] = (byPriority[task.priority] || 0) + 1;
        });

        // Count due this week and overdue
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to start of today
        
        const endOfWeek = new Date(now);
        endOfWeek.setDate(now.getDate() + 7);
        endOfWeek.setHours(23, 59, 59, 999);

        let dueThisWeek = 0;
        let overdue = 0;

        activeTasks.forEach((task: Task) => {
          const dueDate = new Date(task.due_date);
          dueDate.setHours(0, 0, 0, 0); // Normalize to start of day
          
          if (dueDate < now) {
            overdue++;
          } else if (dueDate <= endOfWeek) {
            dueThisWeek++;
          }
        });

        setWorkload({
          byStatus,
          byPriority,
          dueThisWeek,
          overdue,
          total: activeTasks.length,
        });
      } catch (error) {
        console.error('Error fetching workload:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchWorkload();
    }
  }, [userId]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: React.ElementType; bg: string }> = {
      'To Do': { 
        color: 'text-gray-600 dark:text-gray-400', 
        icon: ListChecksIcon,
        bg: 'bg-gray-100 dark:bg-gray-800'
      },
      'In Progress': { 
        color: 'text-blue-600 dark:text-blue-400', 
        icon: ZapIcon,
        bg: 'bg-blue-100 dark:bg-blue-900/30'
      },
      'Review': { 
        color: 'text-purple-600 dark:text-purple-400', 
        icon: BarChart3Icon,
        bg: 'bg-purple-100 dark:bg-purple-900/30'
      },
      'Blocked': { 
        color: 'text-red-600 dark:text-red-400', 
        icon: AlertTriangleIcon,
        bg: 'bg-red-100 dark:bg-red-900/30'
      },
    };
    return configs[status] || configs['To Do'];
  };

  const getPriorityConfig = (priority: string) => {
    const configs: Record<string, { gradient: string; color: string; textColor: string }> = {
      'Critical': { 
        gradient: 'from-red-500 to-red-600', 
        color: 'bg-red-500',
        textColor: 'text-red-600 dark:text-red-400'
      },
      'High': { 
        gradient: 'from-orange-500 to-orange-600', 
        color: 'bg-orange-500',
        textColor: 'text-orange-600 dark:text-orange-400'
      },
      'Medium': { 
        gradient: 'from-amber-500 to-amber-600', 
        color: 'bg-amber-500',
        textColor: 'text-amber-600 dark:text-amber-400'
      },
      'Low': { 
        gradient: 'from-emerald-500 to-emerald-600', 
        color: 'bg-emerald-500',
        textColor: 'text-emerald-600 dark:text-emerald-400'
      },
    };
    return configs[priority] || configs['Medium'];
  };

  if (loading || userLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="p-5">
          <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-32 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-48 animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getWorkloadStatus = () => {
    if (workload.total === 0) return { text: 'No Tasks', color: 'success' as const };
    if (workload.total <= 5) return { text: 'Light', color: 'success' as const, icon: TrendingDownIcon };
    if (workload.total <= 10) return { text: 'Balanced', color: 'info' as const, icon: BarChart3Icon };
    if (workload.total <= 15) return { text: 'Busy', color: 'warning' as const, icon: TrendingUpIcon };
    return { text: 'Overloaded', color: 'error' as const, icon: TrendingUpIcon };
  };

  const workloadStatus = getWorkloadStatus();
  const StatusIcon = workloadStatus.icon;

  // Calculate percentages
  const totalTasks = workload.total || 1;
  const statusEntries = Object.entries(workload.byStatus);
  const priorityEntries = Object.entries(workload.byPriority).sort((a, b) => {
    const order = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
    return (order[a[0] as keyof typeof order] || 99) - (order[b[0] as keyof typeof order] || 99);
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden h-[830px]">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <BarChart3Icon className="text-white size-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                My Workload
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Current task distribution
              </p>
            </div>
          </div>
          <Badge 
            variant="light" 
            size="sm" 
            color={workloadStatus.color}
            startIcon={StatusIcon && <StatusIcon className="w-3 h-3" />}
          >
            {workloadStatus.text}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Total Tasks */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 p-4 border border-blue-200/50 dark:border-blue-800/50">
            <div className="relative z-10">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {workload.total}
              </div>
              <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mt-1">
                Active Tasks
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-10 dark:opacity-5">
              <ListChecksIcon className="w-16 h-16 text-blue-600" />
            </div>
          </div>

          {/* Due This Week */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-orange-100/50 dark:from-amber-900/20 dark:to-orange-800/10 p-4 border border-amber-200/50 dark:border-amber-800/50">
            <div className="relative z-10">
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                {workload.dueThisWeek}
              </div>
              <div className="text-xs font-medium text-orange-700 dark:text-orange-300 mt-1">
                Due This Week
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-10 dark:opacity-5">
              <CalendarIcon className="w-16 h-16 text-orange-600" />
            </div>
          </div>

          {/* Overdue */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 p-4 border border-red-200/50 dark:border-red-800/50">
            <div className="relative z-10">
              <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                {workload.overdue}
              </div>
              <div className="text-xs font-medium text-red-700 dark:text-red-300 mt-1">
                Overdue
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-10 dark:opacity-5">
              <AlertTriangleIcon className="w-16 h-16 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* By Status - Circular Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              By Status
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {statusEntries.length} statuses
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {statusEntries.map(([status, count]) => {
              const config = getStatusConfig(status);
              const StatusIcon = config.icon;
              const percentage = Math.round((count / totalTasks) * 100);

              return (
                <div
                  key={status}
                  className={`group relative overflow-hidden rounded-xl ${config.bg} p-4 transition-all duration-300 hover:shadow-md border border-gray-200/50 dark:border-gray-700/50`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-900/30`}>
                      <StatusIcon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${config.color}`}>
                        {count}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {status}
                  </div>
                  
                  {/* Progress bar at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 dark:bg-gray-900/30">
                    <div
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: status === 'To Do' ? '#6b7280' :
                                       status === 'In Progress' ? '#3b82f6' :
                                       status === 'Review' ? '#a855f7' :
                                       status === 'Blocked' ? '#ef4444' : '#6b7280'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Priority - Horizontal Bars */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FlagIcon className="w-4 h-4" />
              By Priority
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Total: {workload.total}
            </span>
          </div>
          
          <div className="space-y-3">
            {priorityEntries.map(([priority, count]) => {
              const config = getPriorityConfig(priority);
              const percentage = Math.round((count / totalTasks) * 100);

              return (
                <div
                  key={priority}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.color}`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${config.textColor}`}>
                        {count}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                    <div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-500 group-hover:shadow-lg`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Footer */}
        {workload.total > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Workload Efficiency</span>
              <span className="font-medium">
                {workload.overdue > 0 ? (
                  <span className="text-red-600 dark:text-red-400">
                    {workload.overdue} tasks need attention
                  </span>
                ) : (
                  <span className="text-green-600 dark:text-green-400">
                    On track ✓
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};