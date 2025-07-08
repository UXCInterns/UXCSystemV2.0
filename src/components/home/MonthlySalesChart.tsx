"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartTab from "../common/ChartTab";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlySalesChart() {
  const options: ApexOptions = {
    colors: ["#465fff", "#A3B2FB"], // Updated colors
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 198,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%", // No space between bars
        borderRadius: 5,
        borderRadiusApplication: "end",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable number labels on top
    },
    stroke: {
      show: true,
      width: 0, // No stroke so bars touch each other smoothly
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      markers: {
        size: 8,
        shape: "square",
      },
      itemMargin: {
        horizontal: 3,
        vertical: 3,
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      min: 0,
      max: 10, // Make sure y-axis max fits the data below 10
      tickAmount: 5,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: "Core Projects",
      data: [3, 0, 5, 4, 3, 3, 1, 2, 3, 5, 4, 5],
    },
    {
      name: "Support Projects",
      data: [3, 2, 4, 3, 2, 1, 3, 1, 2, 4, 3, 0],
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between w-auto">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Projects By Month
        </h3>
        <ChartTab />
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-auto pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={280}
          />
        </div>
      </div>
    </div>
  );
}
