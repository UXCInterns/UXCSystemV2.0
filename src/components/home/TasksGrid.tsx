"use client";

import React, { useState, useEffect, useMemo } from "react";
import Badge from "../ui/badge/Badge";
import { useUser } from "@/hooks/useUser";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
  ListChecksIcon,
  PlayCircleIcon,
  CalendarIcon,
  FlagIcon,
} from "lucide-react";
import { TaskIcon } from "@/icons";
import Toggle from "../ui/toggle/Toggle";
import Image from "next/image";

// Toggle Component
interface ToggleOption {
  value: string;
  label: string;
}

interface Assignee {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface Task {
  task_id: string;
  task_name: string;
  task_description: string;
  status: string;
  priority: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  project_name?: string;
  assignees: Assignee[];
}

type FilterType = "all" | "urgent" | "due-this-week";

export const TasksGrid = () => {
  const { id: userId, loading: userLoading } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>("all");
  
  const STATUS_ORDER: Record<string, number> = useMemo(() => ({
    'To Do': 1,
    'In Progress': 2,
    'Review': 3,
  }), []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/tasks?assigned_to_id=${userId}`);
        const data = await response.json();

        const filteredAndSortedTasks = (data.tasks || [])
          // remove completed tasks
          .filter((task: Task) => task.status !== 'Done')
          // sort by status order
          .sort((a: Task, b: Task) => {
            const orderA = STATUS_ORDER[a.status] ?? 999;
            const orderB = STATUS_ORDER[b.status] ?? 999;
            return orderA - orderB;
          });

        setTasks(filteredAndSortedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTasks();
    }
  }, [userId, STATUS_ORDER]);

  const getStatusConfig = (status: string) => {
    type BadgeColor = "success" | "error" | "warning" | "purple";
    
    const configs: Record<string, { icon: React.ReactElement; badgeColor: BadgeColor; gradient: string }> = {
      'To Do': {
        icon: <ListChecksIcon className="w-3.5 h-3.5" />,
        badgeColor: 'error' as BadgeColor,
        gradient: 'from-gray-50/50 to-gray-100/30 dark:from-gray-800/10 dark:to-gray-700/5',
      },
      'In Progress': {
        icon: <PlayCircleIcon className="w-3.5 h-3.5" />,
        badgeColor: 'warning',
        gradient: 'from-blue-50/50 to-blue-100/30 dark:from-blue-900/10 dark:to-blue-800/5',
      },
      'Review': {
        icon: <ClockIcon className="w-3.5 h-3.5" />,
        badgeColor: 'purple',
        gradient: 'from-amber-50/50 to-orange-100/30 dark:from-amber-900/10 dark:to-orange-800/5',
      },
      'Done': {
        icon: <CheckCircle2Icon className="w-3.5 h-3.5" />,
        badgeColor: 'success',
        gradient: 'from-emerald-50/50 to-teal-100/30 dark:from-emerald-900/10 dark:to-teal-800/5',
      },
    };
    return configs[status] || configs['To Do'];
  };

  const getPriorityConfig = (priority: string) => {
    type BadgeColor = "success" | "error" | "warning" | "primary";
    
    const configs: Record<string, { badgeColor: BadgeColor }> = {
      'Critical': { badgeColor: 'error' },
      'High': { badgeColor: 'warning' },
      'Medium': { badgeColor: 'primary' },
      'Low': { badgeColor: 'success' },
    };
    return configs[priority] || configs['Medium'];
  };

  const calculateTimeRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let timeText = '';
    let badgeColor: "success" | "error" | "warning" | "info" = 'info';
    
    if (diffDays < 0) {
      timeText = 'Overdue';
      badgeColor = 'error';
    } else if (diffDays === 0) {
      timeText = 'Due Today';
      badgeColor = 'error';
    } else if (diffDays === 1) {
      timeText = '1 day';
      badgeColor = 'warning';
    } else if (diffDays < 7) {
      timeText = `${diffDays} days`;
      badgeColor = 'warning';
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      timeText = `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`;
      badgeColor = 'info';
    } else {
      const months = Math.floor(diffDays / 30);
      timeText = `${months} ${months === 1 ? 'month' : 'months'}`;
      badgeColor = 'success';
    }
    
    return { timeText, badgeColor, diffDays };
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filterType === "all") return true;
    
    if (filterType === "urgent") {
      // Urgent: Critical or High priority
      return task.priority === "Critical" || task.priority === "High";
    }
    
    if (filterType === "due-this-week") {
      // Due this week: due within 7 days
      const { diffDays } = calculateTimeRemaining(task.due_date);
      return diffDays >= 0 && diffDays <= 7;
    }
    
    return true;
  });

  const filterOptions: ToggleOption[] = [
    { value: "all", label: "All Tasks" },
    { value: "urgent", label: "Urgent" },
    { value: "due-this-week", label: "This Week" }
  ];

  if (loading || userLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden h-full flex flex-col">
        {/* Header Skeleton */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-32 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-56 animate-pulse" />
            </div>
            <div className="h-7 bg-gray-200 rounded-full dark:bg-gray-700 w-24 animate-pulse" />
          </div>
        </div>

        {/* List Skeleton */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-white/[0.02] animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Tasks
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tasks assigned to you
              </p>
            </div>
            <Badge variant="light" size="sm" color="info">
              0 Tasks
            </Badge>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center">
            <AlertCircleIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              No Tasks Found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You don&apos;t have any tasks assigned yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-110">
               <TaskIcon className="text-white size-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                My Tasks
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Tasks assigned to you
              </p>
            </div>
          </div>
          <Badge variant="light" size="sm" color="cyan">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
          </Badge>
        </div>

        {/* Filter Toggle */}
        <Toggle
          options={filterOptions}
          selectedValue={filterType}
          onChange={setFilterType}
          className="w-full"
        />
      </div>

      {/* Tasks List - Scrollable */}
      <div className="p-5 h-auto sm:h-[545px] overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <AlertCircleIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                No Tasks Found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No tasks match the selected filter.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 h-[503px] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
            {filteredTasks.map((task) => {
              const statusConfig = getStatusConfig(task.status);
              const priorityConfig = getPriorityConfig(task.priority);
              const { timeText, badgeColor: timeColor } = calculateTimeRemaining(task.due_date);

              return (
                <div
                  key={task.task_id}
                  className={`group relative rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-cyan-50/30 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-100/50 dark:border-gray-800 dark:from-white/[0.03] dark:to-cyan-900/[0.05] dark:hover:shadow-cyan-900/20`}
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    {task.project_name && (
                      <Badge variant="light" size="sm" color="cyan">
                        {task.project_name}
                      </Badge>
                    )}
                    <Badge 
                      variant="light" 
                      size="sm" 
                      color={statusConfig.badgeColor}
                      startIcon={statusConfig.icon}
                    >
                      {task.status}
                    </Badge>
                  </div>

                  {/* Task Name */}
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                      {task.task_name}
                  </h4>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700/50">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="light"
                        size="sm"
                        color={priorityConfig.badgeColor}
                        startIcon={<FlagIcon className="w-3 h-3" />}
                      >
                      {task.priority}
                      </Badge>

                      <Badge
                        variant="light"
                        size="sm"
                        color={timeColor}
                        startIcon={<CalendarIcon className="w-3 h-3" />}
                      >
                      {timeText}
                      </Badge>
                    </div>

                    {/* Assignees */}
                    {task.assignees && task.assignees.length > 0 && (
                      <div className="flex -space-x-2">
                        {task.assignees.slice(0, 3).map((assignee, idx) => (
                          <div
                            key={assignee.id}
                            className="relative"
                            style={{ zIndex: 10 - idx }}
                          >
                            <Image
                              src={assignee.avatar_url || '/images/user/default-avatar.jpg'}
                              alt={assignee.name}
                              width={24}
                              height={24}
                              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 object-cover hover:z-20 transition-all duration-200 hover:scale-125 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer shadow-sm"
                              title={assignee.name}
                            />
                          </div>
                        ))}
                        {task.assignees.length > 3 && (
                          <div 
                            className="relative w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white shadow-sm cursor-pointer hover:scale-125 hover:border-blue-400 transition-all duration-200"
                            title={`${task.assignees.length - 3} more assignees`}
                            style={{ zIndex: 7 }}
                          >
                            +{task.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Subtle Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/[0.02] group-hover:via-purple-500/[0.01] group-hover:to-blue-500/[0.02] transition-all duration-500 pointer-events-none" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};