"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { onProjectUpdate } from "@/lib/projectEvents";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

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

export default function IndividualRoleDistributionChart() {
  const [manpower, setManpower] = useState<ManpowerAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch manpower data from API
  const fetchManpower = async () => {
    try {
      const response = await fetch('/api/manpower');
      if (!response.ok) throw new Error('Failed to fetch manpower data');
      
      const data = await response.json();
      // Sort by total projects descending and take top 10
      const sortedData = (data.manpower || [])
        .sort((a: ManpowerAllocation, b: ManpowerAllocation) => b.total_projects - a.total_projects)
        .slice(0, 10);
      setManpower(sortedData);
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

  // Prepare data for chart
  const categories = manpower.map(p => p.full_name.split(' ')[0]); // Use first name only
  const managerData = manpower.map(p => p.projects_as_manager);
  const leadData = manpower.map(p => p.projects_as_lead);
  const coreData = manpower.map(p => p.projects_as_core_team);
  const supportData = manpower.map(p => p.projects_as_support_team);

  const options: ApexOptions = {
    colors: ["#ef4444", "#f59e0b", "#60a5fa", "#10b981"], // Blue, Purple, Cyan, Gray
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 250,
      stacked: true,
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      labels: {
        colors: "#6b7280",
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
        formatter: (val: number) => Math.floor(val).toString(),
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} project${val !== 1 ? 's' : ''}`,
      },
      theme: "light",
    },
  };

  const series = [
    {
      name: "Manager",
      data: managerData,
    },
    {
      name: "Lead",
      data: leadData,
    },
    {
      name: "Core Team",
      data: coreData,
    },
    {
      name: "Support Team",
      data: supportData,
    },
  ];

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between w-auto mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Role Distribution by Person
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Top 10 people by total project involvement
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-auto pl-2">
          {manpower.length > 0 ? (
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={250}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-4xl mb-3">📊</div>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                No manpower data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}