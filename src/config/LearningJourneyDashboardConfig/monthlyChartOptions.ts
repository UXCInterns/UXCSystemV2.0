import { ApexOptions } from "apexcharts";

interface ChartOptionsParams {
  labels: string[];
  isComparisonMode: boolean;
  hasComparisonData: boolean;
  periodType: string;
}

export const getMonthlyChartOptions = ({
  labels,
  isComparisonMode,
  hasComparisonData,
  periodType,
}: ChartOptionsParams): ApexOptions => {
  return {
    colors: isComparisonMode && hasComparisonData 
      ? ["#465fff", "#FF6B6B"] 
      : ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 198,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: periodType === "quarterly" ? "60%" : "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => (val > 0 ? `${val}` : ""),
      offsetY: -20,
      style: { fontSize: "12px", colors: ["#A1A1AA"] },
    },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontFamily: "Outfit",
      markers: { size: 8 }
    },
    yaxis: {
      title: { text: undefined },
      labels: { formatter: (val: number) => Math.round(val).toString() },
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: { 
      x: { show: false }, 
      y: { formatter: (val: number) => `${val} visitors` },
    },
    noData: {
      text: "No data available for this period",
      align: "center",
      verticalAlign: "middle",
      style: { color: "#6B7280", fontSize: "14px" },
    },
  };
};