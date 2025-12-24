import { ApexOptions } from "apexcharts";

export const getRoleDistributionChartOptions = (
  categories: string[]
): ApexOptions => ({
  colors: ["#ef4444", "#f59e0b", "#60a5fa", "#10b981"],
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
});