"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartTab from "../../common/ChartTab";
import { initialData } from "../manpower/mapowerTable"; // adjust path as needed

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function IndividualChart() {
  const categories = initialData.map((item) => item.members);

  // Use core and support projects as stacked series
  const coreProjects = initialData.map((item) => item.coreProjects || 0);
  const supportProjects = initialData.map((item) => item.supportProjects || 0);

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    colors: ["#465fff", "#a5b4fc"], // Primary & lighter blue
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (val: number) => `${val}`,
      offsetY:0,
      style: {
        fontSize: "12px",
        colors: ["#A1A1AA"],
      },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        rotate: -45,
        style: {
          fontSize: "13px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "13px",
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: "Core Projects",
      data: coreProjects,
    },
    {
      name: "Support Projects",
      data: supportProjects,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg ml-3 font-semibold text-gray-800 dark:text-white/90">
          Projects by Member
        </h3>
      </div>

      <div className="overflow-x-auto custom-scrollbar mt-4">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </div>
  );
}
