import { ApexOptions } from "apexcharts";
import { ChartType } from "@/types/LearningJourneyDashboardTypes/visitorsTimeline";

interface ChartOptionsParams {
  chartType: ChartType;
  categories: string[];
  isComparisonMode: boolean;
}

export const getTimelineChartOptions = ({
  chartType,
  categories,
  isComparisonMode,
}: ChartOptionsParams): ApexOptions => {
  return {
    legend: { 
      show: isComparisonMode,
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: ['#374151', '#6B7280']
      }
    },
    colors: isComparisonMode 
      ? ["#465FFF", "#FF6B6B"]
      : ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: chartType,
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
    },
    stroke: { 
      curve: "smooth", 
      width: chartType === "bar" ? 0 : 2,
    },
    fill: {
      type: chartType === "area" ? "gradient" : "solid",
      gradient: { 
        opacityFrom: 0.55, 
        opacityTo: 0 
      }
    },
    markers: { 
      size: 4, 
      strokeColors: "#fff", 
      strokeWidth: 2, 
      hover: { size: 6 } 
    },
    grid: { 
      xaxis: { lines: { show: false } }, 
      yaxis: { lines: { show: true } }, 
      padding: { right: 10, left: 10 } 
    },
    dataLabels: { enabled: false },
    tooltip: { enabled: true },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: { 
        rotate: categories.length > 15 ? -45 : categories.length > 10 ? -35 : 0, 
        maxHeight: 150, 
        style: { fontSize: "11px" }
      },
    },
    yaxis: { 
      labels: { 
        style: { fontSize: "12px", colors: ["#6B7280"] }, 
        formatter: (val: number) => Math.round(val).toString() 
      } 
    },
    noData: { 
      text: "No visits recorded for this period", 
      align: "center", 
      verticalAlign: "middle", 
      style: { color: "#6B7280", fontSize: "16px" } 
    },
  };
};