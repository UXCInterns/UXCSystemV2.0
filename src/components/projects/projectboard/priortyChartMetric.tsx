import React, { useState } from "react";
import Badge from "../../ui/badge/Badge";
import { useProjectData } from "@/hooks/useProjectData";
import ViewModeToggle from "./futureProjects";

const ProjectGanttChart = () => {
  const { data: projectsData } = useProjectData(); // ✅ use hook
  const [viewMode, setViewMode] = useState<"year" | "month">("year"); // ✅ fixed type
  const [selectedMonth, setSelectedMonth] = useState(8);
  const currentYear = 2025;

  const getTimelineData = () => {
    if (viewMode === "year") {
      return {
        periods: Array.from({ length: 12 }, (_, i) => ({
          label: new Date(currentYear, i).toLocaleDateString("en-US", {
            month: "short",
          }),
          value: i + 1,
          fullDate: new Date(currentYear, i, 1),
        })),
        startDate: new Date(currentYear, 0, 1),
        endDate: new Date(currentYear, 11, 31),
      };
    } else {
      const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();
      return {
        periods: Array.from({ length: daysInMonth }, (_, i) => ({
          label: (i + 1).toString(),
          value: i + 1,
          fullDate: new Date(currentYear, selectedMonth - 1, i + 1),
        })),
        startDate: new Date(currentYear, selectedMonth - 1, 1),
        endDate: new Date(currentYear, selectedMonth - 1, daysInMonth),
      };
    }
  };

  const calculatePosition = (
    startDate: string | number | Date,
    endDate: string | number | Date,
    timelineStart: number | Date,
    timelineEnd: number | Date
  ) => {
    const projectStart = new Date(startDate);
    const projectEnd = new Date(endDate);
    const timelineStartTime =
      timelineStart instanceof Date
        ? timelineStart.getTime()
        : new Date(timelineStart).getTime();
    const timelineEndTime =
      timelineEnd instanceof Date
        ? timelineEnd.getTime()
        : new Date(timelineEnd).getTime();
    const projectStartTime = projectStart.getTime();
    const projectEndTime = projectEnd.getTime();
    const totalDuration = timelineEndTime - timelineStartTime;

    const left = ((projectStartTime - timelineStartTime) / totalDuration) * 100;
    const width = ((projectEndTime - projectStartTime) / totalDuration) * 100;

    return {
      left: Math.max(0, Math.min(100, left)),
      width: Math.max(1, Math.min(100 - left, width)),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-red-400 dark:bg-red-900";
      case "Pending":
        return "bg-yellow-400 dark:bg-yellow-900";
      case "Completed":
        return "bg-green-400 dark:bg-green-900";
      case "Aborted":
        return "bg-blue-400 dark:bg-blue-900";
      default:
        return "bg-gray-500 dark:bg-gray-400";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "error";
      case "High":
        return "warning";
      case "Medium":
        return "primary";
      case "Low":
        return "success";
      default:
        return "light";
    }
  };

  const timeline = getTimelineData();

  const filteredProjects = projectsData.filter((project) => {
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    return (
      projectStart <= timeline.endDate && projectEnd >= timeline.startDate
    );
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Project Timeline
          </h4>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {viewMode === "year"
              ? `${currentYear} Overview`
              : `${months[selectedMonth - 1]} ${currentYear}`}
          </p>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-4">
          {viewMode === "month" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          )}

          <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-full">
          {/* Timeline Header */}
          <div className="flex items-center mb-2 bg-gray-200 dark:bg-gray-900 rounded-md sticky top-0 z-20">
            <div className="w-40 pr-4 py-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 pl-2">
                Project
              </div>
            </div>
            <div className="flex-1 flex">
              {timeline.periods.map((period, index) => (
                <div
                  key={index}
                  className="flex-1 text-center py-2 border-l border-gray-200 dark:border-gray-700 first:border-l-0"
                >
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {period.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Rows - scrollable area */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar pr-1">
            <div className="space-y-3">
              {filteredProjects.map((project) => {
                const position = calculatePosition(
                  project.startDate,
                  project.endDate,
                  timeline.startDate,
                  timeline.endDate
                );

                return (
                  <div
                    key={project.id}
                    className="flex items-center group hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg px-2 py-1 transition-colors"
                  >
                    {/* Project Info */}
                    <div className="w-40 flex-shrink-0 pr-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-800 dark:text-white/90 text-sm truncate">
                            {project.projectName}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              size="sm"
                              color={getPriorityColor(project.priority)}
                            >
                              {project.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    <div className="flex-1 relative h-10 bg-gray-100 dark:bg-gray-800 rounded">
                      {/* Grid Lines */}
                      {timeline.periods.map((_, index) => (
                        <div
                          key={index}
                          className="absolute top-0 bottom-0 border-l border-gray-200 dark:border-gray-700"
                          style={{
                            left: `${(index / timeline.periods.length) * 100}%`,
                          }}
                        />
                      ))}

                      {/* Progress Bar */}
                      <div
                        className={`absolute top-1 bottom-1 rounded ${getStatusColor(
                          project.status
                        )} opacity-80 hover:opacity-100 transition-opacity`}
                        style={{
                          left: `${position.left}%`,
                          width: `${position.width}%`,
                        }}
                      >
                        {/* Tooltip on Hover */}
                        <div className="invisible group-hover:visible absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          {new Date(project.startDate).toLocaleDateString()} -{" "}
                          {new Date(project.endDate).toLocaleDateString()}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-400 dark:bg-red-900 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  In Progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 dark:bg-yellow-900 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 dark:bg-green-900 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Completed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 dark:bg-blue-900 rounded"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Aborted
                </span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <div className="w-4 h-2 bg-white/20 rounded border border-gray-300"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Progress
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGanttChart;
