"use client";
// import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import PaceToggle from "../common/PaceToggle";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const rawValue = 624;
  const maxValue = 1000;
  const series = [(rawValue / maxValue) * 100]; // ~92%

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -95,
        endAngle: 95,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5, // margin is in pixels
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: 10,
            color: "#1D2939",
            fontSize: "16px",
            fontWeight: "600",
          },
          value: {
            fontSize: "60px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function () {
              return `${rawValue}`;
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Total Trainee Hours"],
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.00]">
      <div className="px-5 pt-5 bg-white shadow-default border-b border-gray-200 dark:border-gray-800 rounded-2xl pb-10 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              CET Training Summary
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Total Trainee Hours for January
            </p>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap">
            <PaceToggle />
          </div>
        </div>
        <div className="relative ">
          <div className="max-h-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500 mt-6">
            +10%
          </span>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          We have 200 more visitors than last year.
        </p>
      </div>
    </div>
  );
}
