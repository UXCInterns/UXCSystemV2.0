"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { onProjectUpdate } from "@/lib/projectEvents";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ManpowerAllocation = {
  profile_id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  projects_as_manager: number;
  projects_as_lead: number;
  projects_as_core_team: number;
  projects_as_support_team: number;
  total_projects: number;
  tasks_assigned: number;
  active_projects_count: number;
};

type StatusType = "Available" | "Busy" | "Overloaded";

const StatusDistributionChart = () => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [manpower, setManpower] = useState<ManpowerAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Compute status based on core and support team involvement
  const computeStatus = (record: ManpowerAllocation): StatusType => {
    const coreCount = record.projects_as_core_team;
    const supportCount = record.projects_as_support_team;
    
    // Overloaded: 5+ core OR 5+ support
    if (coreCount >= 5 || supportCount >= 5) {
      return "Overloaded";
    }
    
    // Busy: More than 2 core OR more than 3 support
    if (coreCount > 2 || supportCount > 3) {
      return "Busy";
    }
    
    // Available: 2 or fewer core AND 3 or fewer support
    return "Available";
  };

  // Fetch manpower data from API
  const fetchManpower = async () => {
    try {
      const response = await fetch('/api/manpower');
      if (!response.ok) throw new Error('Failed to fetch manpower data');
      
      const data = await response.json();
      setManpower(data.manpower || []);
    } catch (error) {
      console.error('Error fetching manpower:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManpower();
    
    // Listen for project updates
    const unsubscribe = onProjectUpdate(() => {
      fetchManpower();
    });

    return unsubscribe;
  }, []);

  // Calculate status distribution from manpower data
  const statusData = useMemo(() => {
    const availableCount = manpower.filter(p => computeStatus(p) === "Available").length;
    const busyCount = manpower.filter(p => computeStatus(p) === "Busy").length;
    const overloadedCount = manpower.filter(p => computeStatus(p) === "Overloaded").length;

    return [
      { status: "Available", count: availableCount },
      { status: "Busy", count: busyCount },
      { status: "Overloaded", count: overloadedCount },
    ].filter(item => item.count > 0);
  }, [manpower]);

  const totalPeople = useMemo(() => 
    statusData.reduce((sum, item) => sum + item.count, 0),
    [statusData]
  );

  // Color mapping for status
  const colorMap: { [key: string]: string } = {
    'Available': '#10b981',      // Green
    'Busy': '#f59e0b',           // Yellow/Orange
    'Overloaded': '#ef4444'      // Red
  };

  const chartLabels = statusData.map(item => item.status);
  const chartColors = statusData.map(item => colorMap[item.status] || '#93c5fd');
  const chartSeries = statusData.map(item => item.count);

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      events: {
        dataPointMouseEnter: function (event, chartContext, config) {
          setHoveredValue(chartSeries[config.dataPointIndex]);
          setHoveredLabel(chartLabels[config.dataPointIndex]);
        },
        dataPointMouseLeave: function () {
          setHoveredValue(null);
          setHoveredLabel(null);
        }
      }
    },
    labels: chartLabels,
    colors: chartColors,
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontFamily: "inherit",
              fontWeight: 600,
              color: "#6b7280",
              formatter: function () {
                if (hoveredLabel) {
                  return hoveredLabel;
                }
                return "Total";
              }
            },
            value: {
              show: true,
              fontSize: "28px",
              fontFamily: "inherit",
              fontWeight: 700,
              color: "#111827",
              offsetY: 5,
              formatter: function (val) {
                return hoveredValue !== null ? String(hoveredValue) : String(totalPeople);
              }
            },
            total: {
              show: true,
              fontSize: "15px",
              fontFamily: "inherit",
              fontWeight: 600,
            }
          }
        }
      }
    },
    tooltip: {
      enabled: false,
    },
    states: {
      hover: {
        filter: { type: "lighten" }
      },
      active: {
        filter: { type: "none" }
      }
    }
  };

  const hasData = statusData.length > 0 && totalPeople > 0;

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-white/[0.03] animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="flex flex-col items-center gap-6 xl:flex-row">
          <div className="w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex flex-col gap-4 w-full xl:w-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Status Distribution
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Workforce availability overview
          </p>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Chart + Details */}
          <div className="flex flex-col items-center gap-6 xl:flex-row">
            <div className="w-58 relative">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="donut"
                height={280}
              />
            </div>

            <div className="flex flex-col gap-4 w-full xl:w-auto">
              {statusData.map((item, index) => {
                const percentage = totalPeople > 0 
                  ? Math.round((item.count / totalPeople) * 100) 
                  : 0;
                
                return (
                  <div key={index} className="flex items-start gap-2.5">
                    <div className="flex gap-1 mt-1.5">
                      <div 
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: colorMap[item.status] || '#93c5fd' }}
                      ></div>
                    </div>
                    <div>
                      <h5 className="mb-1 font-medium text-gray-800 text-sm dark:text-white/90">
                        {item.status}
                      </h5>
                      <div className="flex flex-col gap-0.5 text-sm">
                        <div className="flex items-center gap-2">
                          <p 
                            className="font-medium"
                            style={{ color: colorMap[item.status] || '#3b82f6' }}
                          >
                            {percentage}%
                          </p>
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <p className="text-gray-500 dark:text-gray-400">
                            {item.count} {item.count !== 1 ? 'People' : 'Person'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">📊</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            No status distribution data available
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusDistributionChart;